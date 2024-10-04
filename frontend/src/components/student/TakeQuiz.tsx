import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/api/useAuth";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: [
    {
      option: string;
    }
  ];
}

interface TakeQuizProps {
  quizId: string;
}

const TakeQuiz: React.FC<TakeQuizProps> = ({ quizId }) => {
  const { currentUser, getQuizQuestion, submitQuiz, loading, quiz } = useAuth();
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const pageSize = 2;
  const studentId = currentUser?.user?.id;
  const time = quiz?.quiz?.time;

  useEffect(() => {
    if (time && hasStarted) {
      // const timeInSeconds = parseInt(quiz.quiz.time, 10) * 60;
      setTimeLeft(time);
    }
  }, [time, hasStarted]);

  useEffect(() => {
    if (timeLeft > 0 && hasStarted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && hasStarted) {
      handleSubmit();
    }
  }, [timeLeft, hasStarted]);

  useEffect(() => {
    if (quizId && hasStarted) {
      getQuestions();
    }
  }, [quizId, page, hasStarted]);

  const getQuestions = async () => {
    try {
      await getQuizQuestion(quizId, page, pageSize);
      setTotalPages(Math.ceil(quiz?.totalQuestions / pageSize));
    } catch (error) {
      toast.error("Failed to load questions");
    }
  };

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (quizId) {
      try {
        await submitQuiz(quizId, answers, studentId);
        toast.success("Quiz submitted successfully!", { duration: 4000 });
      } catch (error: any) {
        toast.error(error.message, { duration: 4000 });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="quiz">
      <h2 className="text-3xl font-bold">{quiz?.quiz?.title}</h2>
      <p className="text-lg mt-4">{quiz?.quiz?.description}</p>

      {!hasStarted ? (
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => setHasStarted(true)}
        >
          Start Quiz
        </button>
      ) : (
        <>
          <div className="timer text-red-500 font-bold">
            Time left: {formatTime(timeLeft)}
          </div>
          {loading && <p>Loading quiz...</p>}
          {quiz?.questions?.length > 0 ? (
            quiz?.questions?.map((question: Question) => (
              <div key={question.id} className="question mb-4 p-4 border-b">
                <h3>{question.question}</h3>
                {question.options.map((optionObj, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name={question.id}
                      value={index}
                      onChange={() => handleAnswerChange(question.id, index)}
                      checked={answers[question.id] === index}
                    />
                    {optionObj.option}
                  </label>
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No questions available at this moment.
            </p>
          )}

          <div>
            {page > 1 && (
              <button onClick={() => setPage(page - 1)}>Previous</button>
            )}
            {page < totalPages && (
              <button onClick={() => setPage(page + 1)}>Next</button>
            )}
            {page === totalPages && (
              <button onClick={handleSubmit}>Submit Quiz</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TakeQuiz;
