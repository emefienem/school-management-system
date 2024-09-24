const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "2h" }
  );
};

async function sendResetEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendResetEmail,
};
