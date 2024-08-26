const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const complainCtrl = {
  create: async (req, res) => {
    try {
      const { userId, schoolId, complaint } = req.body;
      const date = new Date();

      const complain = await prisma.complain.create({
        data: {
          userId: parseInt(userId),
          schoolId: parseInt(schoolId),
          date,
          complaint,
        },
      });

      res.send(complain);
    } catch (err) {
      res.status(500).json({ error: "Error creating complain", details: err });
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
          user: { select: { name: true } },
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
