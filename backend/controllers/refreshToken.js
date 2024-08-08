const refreshCtrl = {
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
};

module.exports = refreshCtrl;
