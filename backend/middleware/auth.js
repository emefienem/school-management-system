const auth = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, admin) => {
    if (err) return res.status(403).send("Forbidden");

    req.admin = admin;
    next();
  });
};

module.exports = auth;
