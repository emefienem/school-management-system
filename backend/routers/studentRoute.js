const express = require("express");
const router = express.Router();
const studentCtrl = require("../controllers/studentController");

router.post("/register", studentCtrl.studentRegister);
router.post("/login", studentCtrl.studentLogin);

router.get("/get-all-students/:id", studentCtrl.getStudents);
router.get("/get-details/:id", studentCtrl.getStudentDetails);

router.delete("/delete-many-student/:id", studentCtrl.deleteManyStudents);
router.delete(
  "/delete-students-by-class/:id",
  studentCtrl.deleteStudentsByClass
);
router.delete("/delete-student/:id", studentCtrl.deleteStudent);

router.put("/update-student/:id", studentCtrl.updateStudent);

router.put("/update-exam-result/:id", studentCtrl.updateExamResult);

router.put("/student-attendance/:id", studentCtrl.studentAttendance);

router.put(
  "/remove-all-students-attendance-by-subject/:id",
  studentCtrl.clearAllStudentsAttendanceBySubject
);
router.put(
  "/remove-all-students-attendance/:id",
  studentCtrl.clearAllStudentsAttendance
);

router.put(
  "/remove-student-attendance-by-subject/:id",
  studentCtrl.removeStudentAttendanceBySubject
);
router.put(
  "/remove-student-attendance/:id",
  studentCtrl.removeStudentAttendance
);

module.exports = router;