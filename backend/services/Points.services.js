const { PrismaClient } = require("@prisma/client");

class PointServices {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async assignPoint(point) {
    try {
      const student = await this._prisma.student.findUnique({
        where: { id: point.studentId },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      await this._prisma.points.create({
        data: point,
      });

      return "Point assigned successfully";
    } catch (error) {
      console.error("Error assigning point:", error);
      throw new Error("Failed to assign point");
    }
  }
}

module.exports = PointServices;
