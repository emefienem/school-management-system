const express = require("express");
const router = express.Router();
const subjectCtrl = require("../controllers/subjectController");

router.post("/subject-create", subjectCtrl.subjectCreate);

router.get("/all-Subjects/:id", subjectCtrl.allSubjects);
router.get("/class-subjects/:id", subjectCtrl.classSubjects);
router.get("/free-subject-list/:id", subjectCtrl.freeSubjectList);
router.get("/subject/:id", subjectCtrl.getSubjectDetail);

router.delete("/delete-subject/:id", subjectCtrl.deleteSubject);
router.delete("/delete-many-subjects/:id", subjectCtrl.deleteManySubjects);
router.delete(
  "/delete-subjects-by-class/:id",
  subjectCtrl.deleteSubjectsByClass
);

module.exports = router;