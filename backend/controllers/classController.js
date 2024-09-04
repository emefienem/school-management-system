const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const classCtrl = {
  classCreate: async (req, res) => {
    try {
      const { sclassName, adminID } = req.body;

      const existingSclass = await prisma.sclass.findFirst({
        where: { sclassName, schoolId: parseInt(adminID) },
      });

      if (existingSclass) {
        res.send({ message: "Sorry, this class name already exists" });
      } else {
        const newSclass = await prisma.sclass.create({
          data: {
            sclassName,
            schoolId: parseInt(adminID),
          },
        });
        res.send(newSclass);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  classList: async (req, res) => {
    try {
      const { id } = req.params;
      const sclasses = await prisma.sclass.findMany({
        where: { schoolId: parseInt(id) },
      });

      if (sclasses.length > 0) {
        res.send(sclasses);
      } else {
        res.send({ message: "No classes found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getClassDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const sclass = await prisma.sclass.findUnique({
        where: { id: parseInt(id) },
        include: { school: true },
      });

      if (sclass) {
        res.send(sclass);
      } else {
        res.send({ message: "No class found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getClassStudents: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await prisma.student.findMany({
        where: { sclassId: parseInt(id) },
      });

      if (students.length > 0) {
        const modifiedStudents = students.map((student) => {
          const { password, ...rest } = student;
          return rest;
        });
        res.send(modifiedStudents);
      } else {
        res.send({ message: "No students found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.student.deleteMany({
        where: { sclassId: parseInt(id) },
      });
      await prisma.subject.deleteMany({
        where: { sclassId: parseInt(id) },
      });
      await prisma.teacher.updateMany({
        where: { teachSclassId: parseInt(id) },
        data: { teachSclassId: null },
      });

      const deletedClass = await prisma.sclass.delete({
        where: { id: parseInt(id) },
      });

      res.send(deletedClass);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteManyClasses: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedClasses = await prisma.sclass.deleteMany({
        where: { schoolId: parseInt(id) },
      });

      if (deletedClasses.count === 0) {
        return res.send({ message: "No classes found to delete" });
      }

      await prisma.student.deleteMany({
        where: { schoolId: parseInt(req.params.id) },
      });
      await prisma.subject.deleteMany({
        where: { schoolId: parseInt(req.params.id) },
      });
      await prisma.teacher.updateMany({
        where: { schoolId: parseInt(req.params.id) },
        data: { teachSclassId: null },
      });

      res.send(deletedClasses);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = classCtrl;
