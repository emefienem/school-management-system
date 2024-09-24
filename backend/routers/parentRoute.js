const router = require("express").Router();
const parentCtrl = require("../controllers/parentController");

router.post("/register", parentCtrl.parentRegister);
router.post("/login", parentCtrl.parentLogin);

router.get("/get-all-parents/:id", parentCtrl.getParents);
router.get("/infor/:id", parentCtrl.getParentDetails);

router.delete("/delete/:id", parentCtrl.deleteParent);

module.exports = router;
