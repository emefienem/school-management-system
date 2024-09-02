const { PrismaClient, Prisma } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/handler");
const prisma = new PrismaClient();

const teacherCtrl = {
  teacherRegister: async (req, res) => {
    const {
      name,
      email,
      password,
      role,
      schoolId,
      teachSubjectId,
      teachSclassId,
    } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      const existingTeacherByEmail = await prisma.teacher.findFirst({
        where: { email },
      });

      if (existingTeacherByEmail) res.send({ message: "Email already exists" });
      else {
        const teacher = await prisma.teacher.create({
          data: {
            name,
            email,
            password: hashedPass,
            role,
            schoolId,
            teachSubjectId,
            teachSclassId,
          },
        });

        if (teachSubjectId) {
          await prisma.subject.update({
            where: { id: teachSubjectId },
            data: { teacherId: teacher.id },
          });
        }

        res.send({ ...teacher, password: undefined });
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

  teacherLogin: async (req, res) => {
    try {
      let user = await prisma.teacher.findFirst({
        where: { email: req.body.email },
        include: {
          teachSubject: true,
          school: true,
          teachSclass: true,
        },
      });
      if (!user) return res.status(404).json({ message: "Teacher not found" });
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        path: "/auth/access-token",
        signed: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "None",
      }); // 15 minutes
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/auth/refresh-token",
        signed: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "None",
      }); // 7 days

      user.password = undefined;
      res.json({
        user,
        accessToken,
        refreshToken,
      });
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

  getTeachers: async (req, res) => {
    try {
      const teachers = await prisma.teacher.findMany({
        where: { schoolId: parseInt(req.params.id) },
        include: {
          teachSubject: true,
          teachSclass: true,
        },
      });

      if (teachers.length > 0) {
        const modifiedTeachers = teachers.map((teacher) => {
          const { password, ...rest } = teacher;
          return rest;
        });
        res.send(modifiedTeachers);
      } else res.send({ message: "No teachers found" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTeacherDetail: async (req, res) => {
    try {
      const teacher = await prisma.teacher.findFirst({
        where: { id: parseInt(req.params.id) },
        include: {
          teachSubject: true,
          school: true,
          teachSclass: true,
        },
      });
      if (teacher) {
        const { password, ...rest } = teacher;
        res.send(rest);
      } else res.send({ message: "No teacher found" });
    } catch (error) {
      res.stats(500).json({ message: error.message });
    }
  },

  updateTeacherSubject: async (req, res) => {
    try {
      const { teacherId, teachSubjectId } = req.body;
      const updatedTeacher = await prisma.teacher.update({
        where: { id: teacherId },
        data: { teachSubjectId },
      });

      if (teachSubjectId) {
        await prisma.subject.update({
          where: { id: teachSubjectId },
          data: { teacherId: updatedTeacher.id },
        });
      }

      res.send(updatedTeacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTeacher: async (req, res) => {
    try {
      const deletedTeacher = await prisma.teacher.delete({
        where: { id: parseInt(req.params.id) },
      });

      if (deletedTeacher.teachSubjectId) {
        await prisma.subject.update({
          where: { id: deletedTeacher.teachSubjectId },
          data: { teacherId: null },
        });
      }

      res.send(deletedTeacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTeachers: async (req, res) => {
    try {
      const deletedTeachers = await prisma.teacher.findMany({
        where: { schoolId: parseInt(req.params.id) },
      });

      if (deletedTeachers.length > 0) {
        await prisma.teacher.deleteMany({
          where: { schoolId: parseInt(req.params.id) },
        });

        const teacherIds = deletedTeachers.map((teacher) => teacher.id);

        await prisma.subject.updateMany({
          where: { teacherId: { in: teacherIds } },
          daata: { teacherId: null },
        });

        res.send({ deleteCount: deletedTeachers.length });
      } else res.send({ msg: "No teachers found to delete at the moment" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTeachersByClass: async (req, res) => {
    try {
      const deletedTeachers = await prisma.teacher.findMany({
        where: { teachSclassId: parseInt(req.params.id) },
      });

      if (deletedTeachers.length > 0) {
        await prisma.teacher.deleteMany({
          where: { teachSclassId: parseInt(req.params.id) },
        });

        const teacherIds = deletedTeachers.map((teacher) => teacher.id);
        await prisma.subject.updateMany({
          where: { teacherId: { in: teacherIds } },
          data: { teacherId: null },
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  teacherAttendance: async (req, res) => {
    try {
      const { status, date } = req.body;

      const teacher = await prisma.teacher.findFirst({
        where: { id: parseInt(req.params.id) },
        include: { attendance: true },
      });

      if (!teacher) return res.send({ message: "Teacher not found" });

      const existingAttendance = teacher.attendance.find(
        (a) => a.date.toDateString() === new Date(date)
      );
      let result;
      if (existingAttendance) {
        result = await prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: { status },
        });
      } else {
        result = await prisma.attendance.create({
          data: { teacherId: teacher.id, date: new Date(date), status },
        });
      }

      return res.send(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = teacherCtrl;
