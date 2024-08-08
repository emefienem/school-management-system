const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const parentCtrl = {
  parentRegister: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);

      const parent = await prisma.parent.create({
        data: {
          ...req.body,
          password: hashedPass,
          children: {
            connect: { id: req.body.studentId },
          },
        },
        include: { children: true },
      });

      parent.password = undefined;
      res.send(parent);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  parentLogIn: async (req, res) => {
    try {
      const parent = await prisma.parent.findUnique({
        where: { email: req.body.email },
      });

      if (parent) {
        const validated = await bcrypt.compare(
          req.body.password,
          parent.password
        );
        if (validated) {
          parent.password = undefined;
          res.send(parent);
        } else {
          res.send({ message: "Invalid password" });
        }
      } else {
        res.send({ message: "Parent not found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getParentDetails: async (req, res) => {
    try {
      const parent = await prisma.parent.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          children: {
            include: {
              fees: true,
            },
          },
          fees: true,
        },
      });

      if (parent) {
        parent.password = undefined;
        res.send(parent);
      } else {
        res.send({ message: "Parent not found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateParent: async (req, res) => {
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const parent = await prisma.parent.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });

      parent.password = undefined;
      res.send(parent);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteParent: async (req, res) => {
    try {
      const parent = await prisma.parent.delete({
        where: { id: parseInt(req.params.id) },
      });

      res.send(parent);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentFees: async (req, res) => {
    try {
      const fees = await prisma.fee.findMany({
        where: {
          studentId: parseInt(req.params.studentId),
        },
      });

      res.send(fees);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  payFee: async (req, res) => {
    try {
      const { studentId, term } = req.body;

      const fee = await prisma.fee.findFirst({
        where: {
          studentId,
          term,
        },
      });

      if (!fee) {
        return res.status(404).json({ message: "Fee record not found" });
      }

      if (fee.isPaid) {
        return res.status(400).json({ message: "Fee already paid" });
      }

      await prisma.fee.update({
        where: { id: fee.id },
        data: {
          isPaid: true,
          paymentDate: new Date(),
        },
      });

      // Optionally enable the student's account if the fee is paid
      await prisma.student.update({
        where: { id: studentId },
        data: { disabled: false },
      });

      res.status(200).json({ message: "Fee paid successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getStudentInfo: async (req, res) => {
    try {
      const { studentId } = req.params;

      const student = await prisma.student.findFirst({
        where: { id: parseInt(studentId) },
        include: { fees: true }, // Include fee details if needed
      });

      if (!student) {
        return res.status(404).json({ message: "No student found" });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = parentCtrl;
