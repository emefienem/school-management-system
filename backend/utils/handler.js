const jwt = require("jsonwebtoken");

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

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
