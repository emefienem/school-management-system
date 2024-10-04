const router = require("express").Router();
const testCtrl = require("../controllers/testController");

// quiz
router
  .get("/quiz", testCtrl.getAllQuizzesCTR)
  // .get("/quiz/:id", testCtrl.getOneQuizCTR)
  .get("/quiz/:quizId", testCtrl.getQuizQuestionsCTR)
  .post("/createQuiz", testCtrl.createQuizCTR)
  .put("/updateQuiz/:id", testCtrl.updateQuizCTR)
  .delete("/delete/:id", testCtrl.deleteQuizCTR);

//questions

//points
router.post("/assignPoint", testCtrl.assignPointCTR);

//options
router.get("/options/:id", testCtrl.GetOptionsByQuestionIdCTR);
module.exports = router;
