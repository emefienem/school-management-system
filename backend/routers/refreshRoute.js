const express = require("express");
const router = express.Router();
const refreshCtrl = require("../controllers/refreshToken");
const auth = require("../middleware/auth");

router.get("/refresh-token", auth, refreshCtrl.refresh);

module.exports = router;
