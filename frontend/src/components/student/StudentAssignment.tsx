import { useAuth } from "@/api/useAuth";
import { ArrowLeft, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import TakeQuiz from "./TakeQuiz";
import { toast } from "sonner";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subjectId: string;
}

interface Score {
  id: string;
  assignment: {
    title: string;
  };
  score: number;
}

const StudentAssignment = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();

  const {
    getStudentAssignment,
    getScores,
    submitAnswers,
    assignments,
    scores,
    loading,
    error,
    currentUser,
  } = useAuth();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [answerContent, setAnswerContent] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"assignments" | "tests">(
    "assignments"
  );

  const studentId = currentUser?.user?.id;
  const [answeredAssignments, setAnsweredAssignments] = useState<string[]>([]);

  useEffect(() => {
    if (studentId) {
      getStudentAssignment(studentId);
      getScores(studentId);
    }
  }, [studentId]);

  const handleSubmitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedAssignmentId) {
      await submitAnswers(studentId, selectedAssignmentId, answerContent);
      setAnsweredAssignments([...answeredAssignments, selectedAssignmentId]);
      setAnswerContent("");
      setSelectedAssignmentId(null);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white p-2 rounded-full cursor-pointer mr-4"
      />
      <h1 className="text-3xl font-bold mb-6 text-center">Student Dashboard</h1>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin w-12 h-12 text-blue-500" />
        </div>
      )}
      <div className="mb-8">
        <div className="flex justify-center space-x-5 mb-4">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "assignments"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "tests" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Tests
          </button>
        </div>

        {activeTab === "assignments" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Available Assignments
            </h2>
            {assignments.length > 0 ? (
              <ul className="space-y-4">
                {assignments.map((assignment: Assignment) => (
                  <li
                    key={assignment.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {assignment.description}
                    </p>
                    <p className="text-gray-500 mb-4">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setSelectedAssignmentId(assignment.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Answer Assignment
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No new assignments</p>
            )}

            {selectedAssignmentId && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Submit Answer for Assignment {selectedAssignmentId}
                </h3>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <textarea
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="Your answer"
                    required
                    className="block w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
                  >
                    Submit Answer
                  </button>
                </form>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Scores</h2>
              <ul className="space-y-4">
                {scores.length > 0 ? (
                  scores.map((score: Score) => (
                    <li
                      key={score.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {score.assignment.title}:{" "}
                        <span className="text-orange-500">{score.score}</span>
                      </h3>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No scores available yet.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "tests" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tests</h2>
            <QuizSelection />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;

const QuizSelection: React.FC = () => {
  const { getAllQuizzes, loading, quizzes } = useAuth();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    try {
      getAllQuizzes();
    } catch (error: any) {
      toast.error("Failed to load quizzes");
    }
  }, []);

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuizId(quizId);
  };

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  return (
    <div>
      {!selectedQuizId ? (
        <div className="quiz-list">
          <h2>Select a Quiz to Take</h2>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-box border p-4 mb-4 cursor-pointer"
                onClick={() => handleQuizSelect(quiz.id)}
              >
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
              </div>
            ))
          ) : (
            <p>No quizzes available at this moment.</p>
          )}
        </div>
      ) : (
        <TakeQuiz quizId={selectedQuizId} />
      )}
    </div>
  );
};
