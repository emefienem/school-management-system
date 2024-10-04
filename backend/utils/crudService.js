const { PrismaClient } = require("@prisma/client");

class CrudService {
  constructor(modelName) {
    this.model = modelName;
    this.prisma = new PrismaClient();
  }

  async getAll(paginationOptions) {
    try {
      const data = await this.prisma[this.model].findMany({
        ...paginationOptions,
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getOne(id) {
    try {
      const data = await this.prisma[this.model].findUnique({
        where: { id: id },
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async create(newData) {
    try {
      const createdData = await this.prisma[this.model].create({
        data: newData,
      });
      return createdData;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async update(id, updatedData) {
    try {
      const data = await this.prisma[this.model].update({
        where: { id: id },
        data: updatedData,
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async delete(id) {
    try {
      await this.prisma.question.deleteMany({
        where: { quizId: id },
      });

      await this.prisma[this.model].delete({
        where: { id: id },
      });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

module.exports = CrudService;
