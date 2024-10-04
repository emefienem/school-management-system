const { PrismaClient } = require("@prisma/client");

class QuestionService {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async ValidateQuiz(quizId) {
    try {
      const quiz = await this._prisma.quiz.findUnique({
        where: { id: quizId },
      });

      if (!quiz) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating quiz:", error);
      throw new Error("Error validating quiz");
    } finally {
      await this._prisma.$disconnect();
    }
  }

  async GetQuestionsByQuizId(quizId) {
    try {
      const questions = await this._prisma.question.findMany({
        where: { quizId },
      });
      return questions;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    } finally {
      await this._prisma.$disconnect();
    }
  }
}

module.exports = QuestionService;
