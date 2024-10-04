const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/handler");

const studentCtrl = {
  studentRegister: async (req, res) => {
    try {
      const { name, email, password, rollNum, adminID, sclassId } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      if (!sclassId) {
        throw new Error("sclassId must be defined");
      }

      const existingStudent = await prisma.student.findFirst({
        where: {
          rollNum: rollNum,
          schoolId: adminID,
          sclassId: sclassId,
        },
      });
      if (existingStudent) res.send({ message: "Roll Number already exists" });
      else {
        const student = await prisma.student.create({
          data: {
            name,
            email,
            rollNum,
            password: hashedPassword,
            sclassId,
            schoolId: adminID,
          },
        });

        const { password, ...studentData } = student;
        res.status(201).json(studentData);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        switch (error.code) {
          case "P2002":
            return res
              .status(400)
              .json({ message: "Unique constraint failed" });
          default:
            return res.status(500).json({ error: "Database error" });
        }
      }
      res.status(500).json({ error: error.message });
    }
  },

  studentLogin: async (req, res) => {
    try {
      const { rollNum, studentName, password } = req.body;
      const rollNumber = parseInt(rollNum, 10);
      let user = await prisma.student.findFirst({
        where: {
          rollNum: rollNumber,
          name: studentName,
        },
      });

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          user = await prisma.student.findUnique({
            where: { id: user.id },
            include: {
              school: { select: { schoolName: true } },
              sclass: { select: { sclassName: true } },
              examResults: {
                include: { subName: { select: { subName: true } } },
              },
              attendance: {
                include: { subName: { select: { subName: true } } },
              },
            },
          });

          const { password, ...studentData } = user;

          const accessToken = generateAccessToken(studentData);
          const refreshToken = generateRefreshToken(studentData);

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            path: "/auth/access-token",
            signed: true,
            secure: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
            sameSite: "None",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/auth/refresh-token",
            signed: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "None",
          });

          res.json({
            user: studentData,
            accessToken,
            refreshToken,
          });
        } else {
          res.send({ message: "Invalid password" });
        }
      } else {
        res.send({ message: "Student not found" });
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            return res
              .status(400)
              .json({ message: "Unique constraint failed" });
          default:
            return res.status(500).json({ error: "Database error" });
        }
      }
      res.status(500).json({ error: error.message });
    }
  },
  getStudents: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await prisma.student.findMany({
        where: { schoolId: parseInt(id) },
        include: { sclass: { select: { sclassName: true } } },
      });

      if (students.length > 0) {
        const modifiedStudents = students.map(({ password, ...rest }) => rest);
        res.send(modifiedStudents);
      } else res.send({ message: "No students found" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getStudentDetails: async (req, res) => {
    try {
      const { id } = req.params;

      const student = await prisma.student.findFirst({
        where: { id: parseInt(id) },
        include: {
          school: { select: { schoolName: true } },
          sclass: { select: { sclassName: true } },
          examResults: { include: { subName: { select: { subName: true } } } },
          attendance: {
            select: {
              subName: { select: { subName: true } },
              subNameId: true,
              sessions: true,
              status: true,
              date: true,
              presentCount: true,
              absentCount: true,
            },
          },
          parent: true,
          fees: true,
          answer: {
            select: {
              score: true,
              submittedAt: true,
              assignment: true,
            },
          },
        },
      });

      if (!student) {
        return res.status(404).json({ message: "No student found" });
      }

      if (student.disabled) {
        return res
          .status(403)
          .json({ message: "Account is disabled due to unpaid fees" });
      }

      const { password, ...studentData } = student;
      return res.json(studentData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // getStudentDetails: async (req, res) => {
  //   try {
  //     const { id } = req.params;

  //     const student = await prisma.student.findFirst({
  //       where: { id: parseInt(id) },
  //       include: {
  //         school: { select: { schoolName: true } },
  //         sclass: { select: { sclassName: true } },
  //         examResults: { include: { subName: { select: { subName: true } } } },
  //         attendance: {
  //           select: {
  //             subName: { select: { subName: true } },
  //             subNameId: true,
  //             sessions: true,
  //             status: true,
  //             date: true,
  //             presentCount: true,
  //             absentCount: true,
  //           },
  //         },
  //         parent: true,
  //         fees: true,
  //         answers: {
  //           include: {
  //             assignment: { select: { title: true, dueDate: true } },
  //           },
  //           select: {
  //             score: true,
  //             submittedAt: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!student) {
  //       return res.status(404).json({ message: "No student found" });
  //     }

  //     if (student.disabled) {
  //       return res
  //         .status(403)
  //         .json({ message: "Account is disabled due to unpaid fees" });
  //     }

  //     const { password, ...studentData } = student;
  //     return res.json(studentData);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // },

  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.attendance.deleteMany({
        where: { studentId: Number(id) },
      });

      await prisma.examResult.deleteMany({
        where: { studentId: Number(id) },
      });

      const result = await prisma.student.delete({
        where: { id: Number(id) },
      });

      res.send(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteManyStudents: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await prisma.student.deleteMany({
        where: { schoolId: Number(id) },
      });
      if (result.count === 0) {
        res.send({ message: "No students found to delete" });
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteStudentsByClass: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await prisma.student.deleteMany({
        where: { sclassId: Number(id) },
      });
      if (result.count === 0) {
        res.send({ message: "No students found to delete" });
      } else {
        res.send(result);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateStudent: async (req, res) => {
    try {
      const { id } = req.params;
      let updateData = req.body;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
      }

      const result = await prisma.student.update({
        where: { id: Number(id) },
        data: updateData,
      });

      const { password, ...studentWithoutPassword } = result;
      res.send(studentWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateExamResult: async (req, res) => {
    try {
      const { id } = req.params;
      const { subName, marksObtained } = req.body;
      const student = await prisma.student.findUnique({
        where: { id: Number(id) },
        include: { examResults: true },
      });

      if (!student) {
        return res.send({ message: "Student not found" });
      }

      const existingResult = student.examResults.find(
        (result) => result.subNameId === Number(subName)
      );

      const marks = Number(marksObtained);

      if (isNaN(marks)) {
        return res.status(400).send({ message: "Invalid marks value" });
      }

      if (existingResult) {
        await prisma.examResult.update({
          where: { id: existingResult.id },
          data: { marksObtained: marks },
        });
      } else {
        await prisma.examResult.create({
          data: {
            studentId: student.id,
            subNameId: Number(subName),
            marksObtained: marks,
          },
        });
      }

      const updatedStudent = await prisma.student.findUnique({
        where: { id: student.id },
        include: { examResults: true },
      });

      res.send(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  studentAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const { subNameId, status, date } = req.body;
      const student = await prisma.student.findUnique({
        where: { id: Number(id) },
        include: { attendance: true },
      });

      if (!student) {
        return res.send({ message: "Student not found" });
      }

      const subject = await prisma.subject.findUnique({
        where: { id: Number(subNameId) },
      });

      if (!subject) {
        return res.status(404).send({ message: "Subject not found" });
      }

      const existingAttendance = student.attendance.find(
        (a) =>
          new Date(a.date).toDateString() === new Date(date).toDateString() &&
          a.subNameId === Number(subNameId)
      );

      if (existingAttendance) {
        await prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: { status },
        });
      } else {
        const attendedSessions = student.attendance.filter(
          (a) => a.subNameId === Number(subNameId)
        ).length;

        if (attendedSessions >= subject.sessions) {
          return res.send({ message: "Maximum attendance limit reached" });
        }

        if (!status) {
          return res.status(400).send({ message: "Status is required" });
        }

        await prisma.attendance.create({
          data: {
            date: new Date(date),
            status: String(status),
            subNameId: Number(subNameId),
            studentId: student.id,
            teacherId: subject.teacherId || null,
            sessions: attendedSessions + 1,
          },
        });
      }

      const updatedStudent = await prisma.student.findUnique({
        where: { id: student.id },
        include: { attendance: true },
      });

      res.send(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  clearAllStudentsAttendanceBySubject: async (req, res) => {
    try {
      const { id } = req.params;
      const subNameId = Number(id);
      await prisma.attendance.deleteMany({
        where: { subNameId },
      });

      res.send({
        message: "Attendance cleared for all students in the subject",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  clearAllStudentsAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const schoolId = Number(id);
      const students = await prisma.student.findMany({
        where: { schoolId },
        include: { attendance: true },
      });

      for (const student of students) {
        await prisma.attendance.deleteMany({
          where: { studentId: student.id },
        });
      }

      res.send({
        message: "Attendance cleared for all students in the school",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  removeStudentAttendanceBySubject: async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const studentId = Number(req.params.id);
      const subNameId = Number(req.body.subId);

      if (isNaN(subNameId)) {
        return res.status(400).json({ message: "Invalid subId" });
      }
      await prisma.attendance.deleteMany({
        where: {
          studentId,
          subNameId,
        },
      });

      res.send({ message: "Attendance removed for the subject" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeStudentAttendance: async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      await prisma.attendance.deleteMany({
        where: { studentId },
      });

      res.send({
        message: "All attendance records removed for the student",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  enrollSubject: async (req, res) => {
    try {
      const { studentId, subjectId } = req.body;

      const existingEnrollment = await prisma.enrollment.findFirst({
        where: { studentId, subjectId },
      });

      if (existingEnrollment) {
        return res
          .status(400)
          .json({ message: "Student is already enrolled in this subject" });
      }

      const newEnrollment = await prisma.enrollment.create({
        data: {
          studentId,
          subjectId,
        },
      });

      res.status(201).json(newEnrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  dropSubject: async (req, res) => {
    try {
      const { studentId, subjectId } = req.body;

      const enrollment = await prisma.enrollment.findFirst({
        where: { studentId, subjectId },
      });

      if (!enrollment) {
        return res
          .status(404)
          .json({ message: "Student is not enrolled in this subject" });
      }

      await prisma.enrollment.delete({
        where: { id: enrollment.id },
      });

      res.status(200).json({ message: "Subject dropped successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAvailableSubjects: async (req, res) => {
    try {
      const { studentId } = req.body;

      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { sclassId: true },
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const studentClassId = student.sclassId;

      const availableSubjects = await prisma.subject.findMany({
        where: {
          sclassId: { not: studentClassId },
        },
        include: { sclass: true },
      });

      if (availableSubjects.length > 0) {
        res.status(200).json(availableSubjects);
      } else {
        res.status(200).json({ message: "No available subjects found" });
      }
    } catch (error) {
      console.error("Error fetching available subjects:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  },

  getEnrolledSubjects: async (req, res) => {
    try {
      const { studentId } = req.body;

      const enrolledSubjects = await prisma.enrollment.findMany({
        where: { studentId: parseInt(studentId) },
        include: { subject: true },
      });

      res.status(200).json(enrolledSubjects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = studentCtrl;
