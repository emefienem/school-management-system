const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.post("/register", adminCtrl.adminRegister);
router.post("/login", adminCtrl.adminLogin);
router.get("/infor/:id", auth, adminCtrl.getAdminDetail);
router.delete("/delete", adminCtrl.deleteAdmin);
// router.patch("/addcart", auth, adminCtrl.addCart);
// router.post("/forgot-password", adminCtrl.forgotPassword);
// router.post("/reset-password", adminCtrl.resetPassword);

module.exports = router;
