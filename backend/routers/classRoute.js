const express = require("express");
const router = express.Router();
const classCtrl = require("../controllers/classController");

router.post("/create", classCtrl.classCreate);

router.get("/class-list/:id", classCtrl.classList);
router.get("/class/:id", classCtrl.getClassDetail);

router.get("/class/students/:id", classCtrl.getClassStudents);

router.delete("/delete/:id", classCtrl.deleteClass);
router.delete("/delete-classes/:id", classCtrl.deleteManyClasses);

module.exports = router;
