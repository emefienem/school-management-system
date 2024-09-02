const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const noticeCtrl = {
  create: async (req, res) => {
    try {
      const { title, details, date, adminID } = req.body;
      const notice = await prisma.notice.create({
        data: {
          title,
          details,
          date: new Date(date),
          schoolId: adminID,
        },
      });
      res.send(notice);
    } catch (err) {
      // res.status(500).json(err);
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  list: async (req, res) => {
    try {
      const schoolId = parseInt(req.params.id);
      const notices = await prisma.notice.findMany({
        where: { schoolId: schoolId },
      });
      if (notices.length > 0) {
        res.send(notices);
      } else {
        res.send({ message: "No notices found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  update: async (req, res) => {
    try {
      const notice = await prisma.notice.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });
      res.send(notice);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  delete: async (req, res) => {
    try {
      const notice = await prisma.notice.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.send(notice);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteMany: async (req, res) => {
    try {
      const result = await prisma.notice.deleteMany({
        where: { schoolId: parseInt(req.params.id) },
      });
      if (result.count === 0) {
        res.send({ message: "No notices found to delete" });
      } else {
        res.send(result);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = noticeCtrl;
