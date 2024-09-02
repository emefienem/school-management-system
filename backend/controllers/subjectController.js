const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const subjectCtrl = {
  subjectCreate: async (req, res) => {
    try {
      const { subjects, adminID } = req.body;
      const multipleSubject = subjects.map((subject) => ({
        subName: subject.subName,
        subCode: subject.subCode,
        sessions: subject.sessions,
        sclassId: subject.sclassId,
        schoolId: req.body.adminID,
      }));
      const existingSubjectBySubCode = await prisma.subject.findFirst({
        where: {
          subCode: multipleSubject[0].subCode,
          schoolId: adminID,
        },
      });

      if (existingSubjectBySubCode) {
        res.send({
          message: "Sorry this subcode must be unique as it already exists",
        });
      } else {
        const result = await prisma.subject.createMany({
          data: multipleSubject,
        });
        res.send(result);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // allSubjects: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const subjects = await prisma.subject.findMany({
  //       where: { schoolId: parseInt(id) },
  //       include: { sclassName: true },
  //     });

  //     if (subjects.length > 0) {
  //       res.send(subjects);
  //     } else {
  //       res.send({ message: "No subjects found" });
  //     }
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },

  allSubjects: async (req, res) => {
    try {
      const { id } = req.params;

      const schoolId = parseInt(id);
      if (isNaN(schoolId)) {
        return res.status(400).json({ error: "Invalid school ID" });
      }

      const subjects = await prisma.subject.findMany({
        where: { schoolId },
        include: { sclass: true },
      });

      if (subjects.length > 0) res.json(subjects);
      else res.send({ message: "No subjects found" });
    } catch (err) {
      console.error("Error fetching subjects:", err);
      res.status(500).json({
        error: "An error occurred while fetching subjects",
        details: err.message,
      });
    }
  },

  classSubjects: async (req, res) => {
    try {
      const { id } = req.params;
      const subjects = await prisma.subject.findMany({
        where: { sclassNameId: parseInt(id) },
      });

      if (subjects.length > 0) {
        res.send(subjects);
      } else {
        res.send({ message: "No subjects found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  freeSubjectList: async (req, res) => {
    try {
      const { id } = req.params;

      const subjects = await prisma.subject.findMany({
        where: { sclassId: parseInt(id), teacherId: null },
      });

      if (subjects.length > 0) {
        res.send(subjects);
      } else {
        res.send({ message: "No subjects found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getSubjectDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await prisma.subject.findUnique({
        where: { id: parseInt(id) },
        include: { sclass: true, teacher: true },
      });

      if (subject) {
        res.send(subject);
      } else {
        res.send({ message: "No subject found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteSubject: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedSubject = await prisma.subject.delete({
        where: { id: parseInt(id) },
      });

      // the teachSubject field is set to null in teachers
      await prisma.teacher.updateMany({
        where: { teachSubjectId: deletedSubject.id },
        data: { teachSubjectId: null },
      });

      // The objects containing the deleted subject is removed from students' examResult array
      await prisma.examResult.deleteMany({
        where: { subNameId: deletedSubject.id },
      });

      // Remove the objects containing the deleted subject from students' attendance array
      await prisma.attendance.deleteMany({
        where: { subNameId: deletedSubject.id },
      });

      res.send(deletedSubject);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteManySubjects: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedSubjects = await prisma.subject.deleteMany({
        where: { schoolId: parseInt(id) },
      });

      // Set the teachSubject field to null in teachers
      await prisma.teacher.updateMany({
        where: {
          teachSubjectId: {
            in: deletedSubjects.map((subject) => subject.id),
          },
        },
        data: { teachSubjectId: null },
      });

      // Set examResult and attendance to null in all students
      await prisma.student.updateMany({
        data: { examResult: null, attendance: null },
      });

      res.send(deletedSubjects);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteSubjectsByClass: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedSubjects = await prisma.subject.deleteMany({
        where: { sclassNameId: parseInt(id) },
      });

      // Set the teachSubject field to null in teachers
      await prisma.teacher.updateMany({
        where: {
          teachSubjectId: {
            in: deletedSubjects.map((subject) => subject.id),
          },
        },
        data: { teachSubjectId: null },
      });

      // Set examResult and attendance to null in all students
      await prisma.student.updateMany({
        data: { examResult: null, attendance: null },
      });

      res.send(deletedSubjects);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  subjectEdit: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedSubject = await prisma.subject.update({
        where: { id: parseInt(id) },
        data: req.body,
      });

      res.send(updatedSubject);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = subjectCtrl;
