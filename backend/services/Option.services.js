const { PrismaClient } = require("@prisma/client");

class OptionServices {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async ValidateOptions(questionId) {
    try {
      const validateData = await this._prisma.question.findUnique({
        where: { id: questionId },
      });

      return !!validateData; // Return true if validateData exists
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async GetOptionsByQuestionId(questionId) {
    try {
      const options = await this._prisma.option.findMany({
        where: { questionId: questionId },
      });

      return options;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

module.exports = OptionServices;
