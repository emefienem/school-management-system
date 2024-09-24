const bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/handler");
const prisma = new PrismaClient();

const parentCtrl = {
  parentRegister: async (req, res) => {
    try {
      const { name, email, password, schoolId } = req.body;
      const students = await prisma.student.findMany({
        where: { id: { in: req.body.studentIds } },
      });

      if (students.length !== req.body.studentIds.length) {
        return res
          .status(404)
          .json({ message: "One or more students not found" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      const parent = await prisma.parent.create({
        data: {
          name: name,
          email: email,
          password: hashedPass,
          school: { connect: { id: schoolId } },
          children: {
            connect: req.body.studentIds.map((id) => ({ id })),
          },
        },
        include: { children: true, school: true },
      });

      parent.password = undefined;
      res.status(201).send(parent);
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

  parentLogin: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await prisma.parent.findUnique({
        where: { email: email },
        include: { children: true },
      });

      if (!user) {
        return res.status(404).json({ message: "Parent not found" });
      }

      const validated = await bcrypt.compare(req.body.password, user.password);
      if (!validated) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const { password, ...parentData } = user;
      const accessToken = generateAccessToken(parentData);
      const refreshToken = generateRefreshToken(parentData);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        path: "/auth/access-token",
        signed: true,
        secure: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: "None",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/auth/refresh-token",
        signed: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "None",
      });

      res.status(200).json({ user: parentData, accessToken, refreshToken });
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

  getParents: async (req, res) => {
    try {
      const { id } = req.params;
      const parents = await prisma.parent.findMany({
        where: { schoolId: parseInt(id) },
        include: {
          children: {
            select: {
              id: true,
              name: true,
              fees: true,
            },
          },
          fees: true,
        },
      });

      if (parents.length > 0) {
        const modifiedParents = parents.map(({ password, ...rest }) => rest);
        res.send(modifiedParents);
      } else {
        res.send({ message: "No parents found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getParentDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const parentId = parseInt(id);

      if (isNaN(parentId)) {
        return res.status(400).json({ message: "Invalid parent ID" });
      }

      const parent = await prisma.parent.findUnique({
        where: { id: parentId },
        include: {
          children: {
            include: {
              attendance: {
                include: {
                  subName: true,
                },
              },
              examResults: {
                include: {
                  subName: true,
                },
              },
              fees: true,
            },
          },
        },
      });

      if (!parent) {
        return res.status(404).json({ message: "Parent not found" });
      }

      const { password, ...parentData } = parent;

      res.send(parentData);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      const { id } = req.params;
      const parent = await prisma.parent.delete({
        where: { id: parseInt(id) },
      });

      res.send(parent);
    } catch (error) {
      res.status(500).json({ message: error.message });
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

  getStudentInfo: async (req, res) => {
    try {
      const { studentId } = req.params;

      const student = await prisma.student.findFirst({
        where: { id: parseInt(studentId) },
        include: { fees: true },
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
