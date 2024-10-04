const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const assignmentCtrl = {
  createAssignment: async (req, res) => {
    const { title, description, dueDate, subjectId, teacherId } = req.body;

    if (!title || !description || !dueDate || !subjectId || !teacherId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const assignment = await prisma.assignment.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate),
          subjectId,
          teacherId,
        },
      });
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTeacherAssignments: async (req, res) => {
    const { teacherId } = req.body;

    try {
      const assignments = await prisma.assignment.findMany({
        where: { teacherId },
        include: { answers: true },
      });
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStudentAssignments: async (req, res) => {
    const { studentId } = req.body;

    try {
      const assignments = await prisma.assignment.findMany({
        include: {
          answers: {
            where: { studentId },
          },
        },
      });
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  submitAnswer: async (req, res) => {
    const { content, assignmentId, studentId } = req.body;

    if (!content || !assignmentId || !studentId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const answer = await prisma.answer.create({
        data: {
          content,
          studentId,
          assignmentId,
        },
      });
      res.json(answer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStudentScores: async (req, res) => {
    const { studentId } = req.body;
    try {
      const answers = await prisma.answer.findMany({
        where: { studentId },
        include: {
          assignment: true,
        },
      });
      res.json(answers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStudentSubmissions: async (req, res) => {
    const { assignmentId } = req.params;

    try {
      const submissions = await prisma.answer.findMany({
        where: { assignmentId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              rollNum: true,
            },
          },
        },
      });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  gradeAnswer: async (req, res) => {
    const { score, id } = req.body;
    try {
      const updatedAnswer = await prisma.answer.update({
        where: { id },
        data: { score },
      });
      res.json(updatedAnswer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAssignment: async (req, res) => {
    try {
      const { assignmentId } = req.params;

      const id = Number(assignmentId, 10);

      if (isNaN(id)) {
        console.log("Invalid assignment ID passed:", id);
        return res.status(400).json({ message: "Invalid assignment ID." });
      }

      await prisma.answer.deleteMany({
        where: { assignmentId: id },
      });

      await prisma.assignment.delete({
        where: { id: id },
      });

      return res
        .status(200)
        .json({ message: "Assignment deleted successfully." });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = assignmentCtrl;
