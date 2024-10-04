const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const OptionServices = require("../services/Option.services");
const PointServices = require("../services/Points.services");
// const QuestionService = require("../services/Questions.services");
const CrudService = require("../utils/crudService");

const optionService = new OptionServices();
const pointServices = new PointServices();
// const questionsServices = new QuestionService();

const quizCrudService = new CrudService("quiz");

const calculateMinPoints = (questions) => {
  return questions.reduce(
    (minPoints, question) => minPoints + (question.points || 0),
    0
  );
};

const testCtrl = {
  GetOptionsByQuestionIdCTR: async (req, res) => {
    try {
      const questionId = Number(req.params.id);
      const validateQuestion = await optionService.ValidateOptions(questionId);
      if (!validateQuestion) {
        res.status(404).json({ error: "Options not found" });
        return;
      }

      const data = await optionService.GetOptionsByQuestionId(questionId);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Points
  assignPointCTR: async (req, res) => {
    try {
      const data = req.body;

      if (!data) {
        return res.status(400).json({ error: "No data provided" });
      }

      const result = await pointServices.assignPoint(data);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error assigning point:", error);
      return res.status(500).json({ message: error.message });
    }
  },

  //quiz
  createQuizCTR: async (req, res) => {
    try {
      const { title, description, time, questions } = req.body;

      if (!questions || questions.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one question is required" });
      }

      const timeInMinutes = time / 60;

      const MinPoints = questions.reduce(
        (total, question) => total + (question.points || 0),
        0
      );

      const quizData = {
        title,
        description,
        time: timeInMinutes,
        MinPoints,
        questions: {
          create: questions.map((q) => ({
            question: q.text,
            points: q.points || 0,
            options: {
              create: q.options.map((option, index) => ({
                option,
                isCorrect: index === q.correctOption,
              })),
            },
          })),
        },
      };

      await quizCrudService.create(quizData);

      return res.status(201).json({ message: "Quiz created successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error creating quiz: " + error.message });
    }
  },

  getQuizQuestionsCTR: async (req, res) => {
    try {
      const { quizId } = req.params;
      const { page = 1, pageSize = 2 } = req.query;

      if (!quizId) {
        return res.status(400).json({ message: "Quiz ID is required" });
      }

      const skip = (page - 1) * pageSize;

      const quiz = await prisma.quiz.findUnique({
        where: { id: Number(quizId) },
        select: {
          title: true,
          description: true,
          time: true,
        },
      });

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const totalQuestions = await prisma.question.count({
        where: { quizId: Number(quizId) },
      });

      const questions = await prisma.question.findMany({
        where: { quizId: Number(quizId) },
        include: { options: true },
        skip: parseInt(skip),
        take: parseInt(pageSize),
      });

      res.status(200).json({
        quiz,
        questions,
        totalQuestions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  getAllQuizzesCTR: async (req, res) => {
    try {
      const quizzes = await prisma.quiz.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          time: true,
        },
      });

      return res.status(200).json(quizzes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  updateQuizCTR: async (req, res) => {
    try {
      const idQuiz = Number(req.params.id);
      const quizData = req.body;

      if (isNaN(idQuiz) || quizData === null) {
        return res.status(400).json({ error: "Invalid id or data provided" });
      }

      await quizCrudService.update(idQuiz, quizData);

      res.status(200).json({ message: "Quiz updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  submitQuizCTR: async (req, res) => {
    try {
      const { quizId, answers, studentId } = req.body;

      if (!quizId || !answers) {
        return res
          .status(400)
          .json({ error: "Quiz ID and answers are required" });
      }

      const questions = await prisma.question.findMany({
        where: { quizId: Number(quizId) },
        include: { options: { where: { isCorrect: true } } },
      });

      let totalPoints = 0;
      let score = 0;

      questions.forEach((question) => {
        const studentAnswer = answers[question.id];
        const correctAnswer = question.options[0];

        if (correctAnswer && correctAnswer.index === studentAnswer) {
          score += question.points;
        }

        totalPoints += question.points;
      });

      const result = {
        totalPoints,
        score,
        percentage: (score / totalPoints) * 100,
      };

      await prisma.quiz.create({
        data: {
          studentId: studentId,
          quizId: Number(quizId),
          score: result.score,
          percentage: result.percentage,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  },

  deleteQuizCTR: async (req, res) => {
    try {
      const { id } = req.params;

      await quizCrudService.delete(Number(id));

      return res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = testCtrl;
