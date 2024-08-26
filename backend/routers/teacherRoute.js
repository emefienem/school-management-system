const express = require("express");
const router = express.Router();
const teacherCtrl = require("../controllers/teacherController");

router.post("/register", teacherCtrl.teacherRegister);
router.post("/login", teacherCtrl.teacherLogin);

router.get("/get-all-teachers/:id", teacherCtrl.getTeachers);
router.get("/infor/:id", teacherCtrl.getTeacherDetail);

router.delete("/delete-many-teachers/:id", teacherCtrl.deleteTeachers);
router.delete("/teachers-by-class/:id", teacherCtrl.deleteTeachersByClass);
router.delete("/delete-teacher/:id", teacherCtrl.deleteTeacher);

router.put("/update-teacher-subject", teacherCtrl.updateTeacherSubject);

router.post("/teacher-attendance/:id", teacherCtrl.teacherAttendance);

module.exports = router;
