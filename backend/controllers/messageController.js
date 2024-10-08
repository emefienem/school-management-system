const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const messageCtrl = {
  sendMessage: async (req, res) => {
    try {
      const { senderEmail, receiverEmail, text } = req.body;

      if (!senderEmail || !receiverEmail || !text) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const message = await prisma.message.create({
        data: {
          senderEmail,
          receiverEmail,
          text,
          timestamp: new Date(),
        },
      });

      res.json(message);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { user1Email, user2Email } = req.params;

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderEmail: user1Email, receiverEmail: user2Email },
            { senderEmail: user2Email, receiverEmail: user1Email },
          ],
        },
        orderBy: { timestamp: "asc" },
      });

      res.json(messages);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createContact: async (req, res) => {
    try {
      const { name, email, role } = req.body;

      if (!name || !email || !role) {
        return res.status(400).json({ error: "Missing fields" });
      }

      let newContact;

      // Create contact in the appropriate table based on role
      if (role === "parent") {
        newContact = await prisma.parent.create({ data: { name, email } });
      } else if (role === "student") {
        newContact = await prisma.student.create({ data: { name, email } });
      } else if (role === "teacher") {
        newContact = await prisma.teacher.create({ data: { name, email } });
      } else {
        return res.status(400).json({ error: "Invalid role" });
      }

      res.json({
        message: "Contact created successfully",
        contact: newContact,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getContacts: async (req, res) => {
    try {
      const admin = await prisma.admin.findMany();
      const parents = await prisma.parent.findMany();
      const students = await prisma.student.findMany();
      const teachers = await prisma.teacher.findMany();

      const contacts = [
        ...admin.map((a) => ({ name: a.name, email: a.email })),
        ...parents.map((p) => ({ name: p.name, email: p.email })),
        ...students.map((s) => ({ name: s.name, email: s.email })),
        ...teachers.map((t) => ({ name: t.name, email: t.email })),
      ];

      res.json(contacts);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = messageCtrl;
