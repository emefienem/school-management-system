const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");
const auth = require("../middleware/auth");

router.get("/refresh-token", auth, authCtrl.refresh);

router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/verify-reset-code", authCtrl.verifyCode);
router.post("/reset-password", authCtrl.resetPassword);

module.exports = router;
