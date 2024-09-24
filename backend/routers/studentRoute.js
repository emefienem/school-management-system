const express = require("express");
const router = express.Router();
const studentCtrl = require("../controllers/studentController");

router.post("/register", studentCtrl.studentRegister);
router.post("/login", studentCtrl.studentLogin);
router.post("/enroll", studentCtrl.enrollSubject);
router.post("/drop-subject", studentCtrl.dropSubject);
router.post("/available-subjects", studentCtrl.getAvailableSubjects);

router.get("/get-all-students/:id", studentCtrl.getStudents);
router.get("/infor/:id", studentCtrl.getStudentDetails);
router.post("/enrolled-subject", studentCtrl.getEnrolledSubjects);

router.delete("/delete-many-student/:id", studentCtrl.deleteManyStudents);
router.delete(
  "/delete-students-by-class/:id",
  studentCtrl.deleteStudentsByClass
);
router.delete("/delete/:id", studentCtrl.deleteStudent);

router.put("/:id", studentCtrl.updateStudent);

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
