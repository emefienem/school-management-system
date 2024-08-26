const { PrismaClient, Prisma } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/handler");

const adminCtrl = {
  adminRegister: async (req, res) => {
    try {
      const { name, email, schoolName, password } = req.body;

      if (!name || !email || !schoolName || !password) {
        return res.status(400).json({
          message: "All fields are required.",
        });
      }

      const existingAdminByEmail = await prisma.admin.findUnique({
        where: { email },
      });

      if (existingAdminByEmail) {
        return res.status(403).json({
          message: "User Already Exists.",
        });
      }

      const existingSchool = await prisma.admin.findUnique({
        where: { schoolName },
      });

      if (existingSchool) {
        return res.status(400).json({ message: "School name already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.admin.create({
        data: {
          name,
          email,
          schoolName,
          password: hashedPassword,
        },
      });

      admin.password = undefined;
      res.status(201).json(admin);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        switch (err.code) {
          case "P2002":
            return res
              .status(400)
              .json({ message: "Unique constraint failed" });
          default:
            return res.status(500).json({ error: "Database error" });
        }
      }
      res.status(500).json({ error: err.message });
    }
  },

  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await prisma.admin.findUnique({ where: { email } });

      if (!user) return res.status(404).json({ message: "User not found" });

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        path: "/auth/access-token",
        signed: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "None",
      }); // 15 minutes
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/auth/refresh-token",
        signed: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "None",
      }); // 7 days

      user.password = undefined;
      res.json({
        user,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        switch (err.code) {
          case "P2002":
            return res
              .status(400)
              .json({ message: "Unique constraint failed" });
          default:
            return res.status(500).json({ error: "Database error" });
        }
      }
      res.status(500).json({ error: err.message });
    }
  },

  // getAdmins: async (req, res) => {
  //   try {
  //     const admins = await prisma.admin.findMany();
  //     if (admins.length > 0) {
  //       const modifiedAdmins = admins.map(({ password, ...rest }) => rest);
  //       return res.status(200).json(modifiedAdmins);
  //     } else {
  //       return res.status(404).json({ message: "No admins found" });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },

  getAdminDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const admin = await prisma.admin.findFirst({
        where: { id: parseInt(id) },
      });

      if (!admin) {
        return res.status(404).json({ message: "No admin found" });
      }

      admin.password = undefined;
      res.json(admin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const deletedAdmin = await prisma.admin.delete({
        where: { id: parseInt(req.params.id) },
      });

      res.status(200).json(deletedAdmin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  checkAndDisableAccounts: async () => {
    try {
      const unpaidFees = await prisma.fee.findMany({
        where: {
          isPaid: false,
          paymentDate: null,
        },
      });

      const studentIds = unpaidFees.map((fee) => fee.studentId);

      await prisma.student.updateMany({
        where: {
          id: {
            in: studentIds,
          },
        },
        data: {
          disabled: true,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUnpaidFees: async (req, res) => {
    try {
      const unpaidFees = await prisma.fee.findMany({
        where: {
          paid: false,
        },
      });

      res.send(unpaidFees);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = adminCtrl;
