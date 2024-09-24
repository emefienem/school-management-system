const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");

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

      const parents = await prisma.parent.findMany({
        select: { email: true },
      });
      const teachers = await prisma.teacher.findMany({
        select: { email: true },
      });

      const recipientEmails = [
        ...parents.map((p) => p.email),
        ...teachers.map((t) => t.email),
      ];

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASS,
        },
      });

      const mailOptions = {
        from: process.env.MY_EMAIL,
        bcc: recipientEmails,
        subject: `${title}`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
  <h2 style="color: #0056b3; font-size: 24px;">Notice from Management</h2>
  <p style="font-size: 16px; line-height: 1.5;">
    Dear Esteemed Parent and Teachers,
  </p>
  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    We would like to inform you of the following notice:
  </p>
  <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd;">
    <p style="font-size: 16px; color: #555;">${details}</p>
  </div>
  <p style="font-size: 14px; margin-top: 15px;">
    <strong>Date:</strong> ${new Date(date).toLocaleDateString()}
  </p>
  <p style="font-size: 14px; margin-top: 30px; color: #555;">
    Best regards,
  </p>
  <p style="font-size: 14px; font-weight: bold; color: #333;">
    Signed Management
  </p>
</div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Emails sent: " + info.response);
        }
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
