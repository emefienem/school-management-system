const router = require("express").Router();
const assignmentCtrl = require("../controllers/assignmentController");

router.get("/submissions/:id", assignmentCtrl.getStudentSubmissions);

router.post("/list", assignmentCtrl.getTeacherAssignments);
router.post("/students-list", assignmentCtrl.getStudentAssignments);
router.post("/students/scores", assignmentCtrl.getStudentScores);
router.post("/create", assignmentCtrl.createAssignment);
router.post("/submit", assignmentCtrl.submitAnswer);
router.post("/grade", assignmentCtrl.gradeAnswer);

router.delete("/delete/:assignmentId", assignmentCtrl.deleteAssignment);

module.exports = router;
