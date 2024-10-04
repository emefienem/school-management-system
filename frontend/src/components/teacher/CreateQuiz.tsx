import React, { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/api/useAuth";
import { toast } from "sonner";

interface Question {
  text: string;
  options: string[];
  correctOption: number;
  points?: number;
}

interface QuizData {
  title: string;
  description: string;
  questions: Question[];
  MinPoints: any;
  time: number;
}

const CreateQuizForm: React.FC = () => {
  const { createQuiz } = useAuth();
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: ["", "", "", ""], correctOption: 0 },
  ]);
  const [timeLimit, setTimeLimit] = useState<number>(0);

  const handleQuestionChange = (index: number, newText: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = newText;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    newText: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = newText;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex: number, correctOption: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = correctOption;
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctOption: 0 },
    ]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const MinPoints = questions.reduce(
      (minPoints, question) => minPoints + (question.points || 0),
      0
    );
    const toastId = toast.loading("Creating Quiz....");
    try {
      const quizData: QuizData = {
        title: quizTitle,
        description: quizDescription,
        questions,
        MinPoints,
        time: timeLimit,
      };
      await createQuiz(quizData);
      toast.success("Created quiz successfully");
      setQuizTitle("");
      setQuizDescription("");
      setQuestions([{ text: "", options: ["", "", "", ""], correctOption: 0 }]);
      setTimeLimit(0);
    } catch (error: any) {
      toast.error(error.message, { duration: 4000 });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Quiz</h2>

        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Quiz Description"
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <input
          type="number"
          placeholder="Time Limit (in minutes)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm"
          >
            <input
              type="text"
              placeholder="Question Text"
              value={question.text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="ml-2">
                  <input
                    type="radio"
                    name={`correctOption${qIndex}`}
                    checked={question.correctOption === oIndex}
                    onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                  />
                  Correct
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={addNewQuestion}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
          >
            Add New Question
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Create Quiz
          </button>
        </div>
      </form>

      <QuizList />
    </div>
  );
};

const QuizList: React.FC = () => {
  const { getAllQuizzes, deleteQuiz, quizzes } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        await getAllQuizzes();
      } catch (error: any) {
        toast.error("Failed to fetch quizzes");
      }
    };
    fetchQuizzes();
  }, [getAllQuizzes]);

  const handleDelete = async (id: number) => {
    try {
      await deleteQuiz(id);
      toast.success("Quiz deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete quiz");
    }
  };

  return (
    <div className="mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="mb-4 border p-4 rounded-lg shadow-md bg-white"
            >
              <h3 className="font-bold text-xl">{quiz.title}</h3>
              <p>{quiz.description}</p>
              <p>Time Limit: {quiz.time} minutes</p>
              <button
                onClick={() => handleDelete(quiz.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300 mt-2"
              >
                Delete Quiz
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateQuizForm;
