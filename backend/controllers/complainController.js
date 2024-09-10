const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const complainCtrl = {
  create: async (req, res) => {
    try {
      const { studentId, teacherId, schoolId, complaint } = req.body;
      const date = new Date();

      // Validate input data
      if ((!studentId && !teacherId) || (studentId && teacherId)) {
        return res.status(400).json({
          message: "Either studentId or teacherId must be set, but not both",
        });
      }

      if (
        (!studentId || isNaN(studentId)) &&
        (!teacherId || isNaN(teacherId))
      ) {
        return res
          .status(400)
          .json({ message: "Invalid student or teacher ID" });
      }

      if (!schoolId || isNaN(schoolId)) {
        return res.status(400).json({ message: "Invalid school ID" });
      }

      // Check if the user is either a valid student or teacher
      let userExists;
      if (studentId) {
        userExists = await prisma.student.findUnique({
          where: { id: parseInt(studentId) },
        });
      } else if (teacherId) {
        userExists = await prisma.teacher.findUnique({
          where: { id: parseInt(teacherId) },
        });
      }

      if (!userExists) {
        return res.status(400).json({ message: "User not found" });
      }

      // Create the complaint
      const complain = await prisma.complain.create({
        data: {
          studentId: studentId ? parseInt(studentId) : null,
          teacherId: teacherId ? parseInt(teacherId) : null,
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
  // create: async (req, res) => {
  //   try {
  //     const { userId, schoolId, complaint } = req.body;
  //     const date = new Date();

  //     if (!userId || isNaN(userId) || !schoolId || isNaN(schoolId)) {
  //       return res.status(400).json({ message: "Invalid user or school ID" });
  //     }

  //     const complain = await prisma.complain.create({
  //       data: {
  //         userId: parseInt(userId),
  //         schoolId: parseInt(schoolId),
  //         date,
  //         complaint,
  //       },
  //     });

  //     res.send(complain);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },

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
