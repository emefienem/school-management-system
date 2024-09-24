const { sendResetEmail } = require("../utils/handler");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const authCtrl = {
  refresh: async (req, res) => {
    try {
      const refreshToken = req.signedCookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).send("Unauthorized");
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, admin) => {
          if (err) {
            return res.status(403).send("Forbidden");
          }

          const accessToken = generateAccessToken(admin);

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000,
          }); // 15 minutes
          res.json({ accessToken });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user =
        (await prisma.admin.findUnique({ where: { email } })) ||
        (await prisma.teacher.findUnique({ where: { email } })) ||
        (await prisma.student.findUnique({ where: { email } })) ||
        (await prisma.parent.findUnique({ where: { email } }));

      if (!user) {
        return res.status(404).send("User not found");
      }

      const resetCode = crypto.randomBytes(3).toString("hex");

      await prisma.passwordReset.create({
        data: {
          email,
          code: resetCode,
          expiresAt: new Date(Date.now() + 3600000), // 1-hour expiration
        },
      });

      await sendResetEmail(email, resetCode);

      res.status(200).send("Reset code sent to your email");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  verifyCode: async (req, res) => {
    try {
      const { email, code } = req.body;

      const resetRequest = await prisma.passwordReset.findFirst({
        where: {
          email,
          code,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!resetRequest) {
        return res.status(400).send("Invalid or expired code");
      }

      res.status(200).send("Code verified, proceed to reset password");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;

      const resetRequest = await prisma.passwordReset.findFirst({
        where: {
          email,
          code,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!resetRequest) {
        return res.status(400).send("Invalid or expired code");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      (await prisma.admin.updateMany({
        where: { email },
        data: { password: hashedPassword },
      })) ||
        (await prisma.teacher.updateMany({
          where: { email },
          data: { password: hashedPassword },
        })) ||
        (await prisma.student.updateMany({
          where: { email },
          data: { password: hashedPassword },
        })) ||
        (await prisma.parent.updateMany({
          where: { email },
          data: { password: hashedPassword },
        }));

      await prisma.passwordReset.delete({ where: { id: resetRequest.id } });

      res.status(200).send("Password updated successfully");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authCtrl;
