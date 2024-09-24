const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const complainCtrl = {
  create: async (req, res) => {
    try {
      const { studentId, teacherId, parentId, schoolId, complaint } = req.body;
      const date = new Date();

      if (
        (!studentId && !teacherId && !parentId) ||
        (studentId && teacherId && parentId)
      ) {
        return res.status(400).json({
          message:
            "Either studentId, teacherId or parentId must be set, but not more than one",
        });
      }

      if (
        (!studentId || isNaN(studentId)) &&
        (!teacherId || isNaN(teacherId)) &&
        (!parentId || isNaN(parentId))
      ) {
        return res
          .status(400)
          .json({ message: "Invalid student, teacher or parent ID" });
      }

      if (!schoolId || isNaN(schoolId)) {
        return res.status(400).json({ message: "Invalid school ID" });
      }

      let userExists;
      if (studentId) {
        userExists = await prisma.student.findUnique({
          where: { id: parseInt(studentId) },
        });
      } else if (teacherId) {
        userExists = await prisma.teacher.findUnique({
          where: { id: parseInt(teacherId) },
        });
      } else if (parentId) {
        userExists = await prisma.parent.findUnique({
          where: { id: parseInt(parentId) },
        });
      }

      if (!userExists) {
        return res.status(400).json({ message: "User not found" });
      }

      const complain = await prisma.complain.create({
        data: {
          studentId: studentId ? parseInt(studentId) : null,
          teacherId: teacherId ? parseInt(teacherId) : null,
          parentId: parentId ? parseInt(parentId) : null,
          schoolId: parseInt(schoolId),
          date,
          complaint,
        },
      });

      res.send(complain);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  list: async (req, res) => {
    try {
      const schoolId = parseInt(req.params.id);

      if (isNaN(schoolId)) {
        return res.status(400).json({ error: "Invalid school ID" });
      }

      const complains = await prisma.complain.findMany({
        where: { schoolId },
        include: {
          teacher: { select: { name: true } },
          student: { select: { name: true } },
        },
      });

      if (complains.length > 0) {
        res.send(complains);
      } else {
        res.send({ message: "No complains found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Error fetching complains", details: err });
    }
  },
};

module.exports = complainCtrl;
