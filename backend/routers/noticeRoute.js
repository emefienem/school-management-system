const router = require("express").Router();
const noticeCtrl = require("../controllers/noticeController");

router.post("/create", noticeCtrl.create);
router.get("/list/:id", noticeCtrl.list);
router.put("/update/:id", noticeCtrl.update);
router.delete("/delete/:id", noticeCtrl.delete);
router.delete("/delete-many/:id", noticeCtrl.delete);

module.exports = router;
