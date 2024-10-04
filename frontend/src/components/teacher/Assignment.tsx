import { useAuth } from "@/api/useAuth";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import CreateQuizForm from "./CreateQuiz";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subjectId: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  student: {
    id: string;
    name: string;
  };
  content: string;
}

const Assignment = () => {
  const navigate = useNavigate();
  const {
    createAssignment,
    getAssignments,
    gradeAssignment,
    getStudentSubmissions,
    assignments,
    submissions,
    loading,
    currentUser,
    deleteAss,
  } = useAuth();

  const subjectId = currentUser?.user?.teachSubject?.id;
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: "",
    description: "",
    dueDate: "",
    subjectId,
  });
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>(
    assignments || []
  );

  const [score, setScore] = useState<number>(0);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<"assignments" | "tests">(
    "assignments"
  );

  const teacherId = currentUser?.user?.id;

  useEffect(() => {
    if (teacherId) getAssignments(teacherId);
  }, [teacherId]);

  useEffect(() => {
    setLocalAssignments(assignments);
  }, [assignments]);

  const handleCreateAssignment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const assignmentData = {
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      subjectId: subjectId,
      teacherId: teacherId,
    };

    if (
      !assignmentData.title ||
      !assignmentData.description ||
      !assignmentData.dueDate
    ) {
      console.error("Invalid assignment data", assignmentData);
      return;
    }
    const toastId = toast.loading("Creating assignment...");
    try {
      await createAssignment(assignmentData);
      setNewAssignment({
        title: "",
        description: "",
        dueDate: "",
        subjectId: subjectId,
      });
      toast.success(`Created Assignment ${assignmentData.title}`);
    } catch (error: any) {
      toast.error(error, { duration: 4000 });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleGrade = async (id: string) => {
    const toastId = toast.loading("Grading...");
    try {
      await gradeAssignment(score, id);
      toast.success("Graded successfully");
    } catch (error: any) {
      toast.error(error, { duration: 4000 });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleViewSubmissions = async (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    await getStudentSubmissions(assignmentId);

    const filtered = submissions.filter(
      (submission: Submission) => submission.assignmentId === assignmentId
    );
    setFilteredSubmissions(filtered);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const toastId = toast.loading("Deleting assignment...", {
        duration: 4000,
      });
      try {
        await deleteAss(assignmentId);
        toast.success("Assignment deleted successfully", { duration: 4000 });

        const updatedAssignments = assignments.filter(
          (assignment: Assignment) => assignment.id !== assignmentId
        );
        setLocalAssignments(updatedAssignments);
      } catch (error: any) {
        toast.error("Error deleting assignment", { duration: 4000 });
      } finally {
        toast.dismiss(toastId);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center mb-8">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white p-2 rounded-full cursor-pointer mr-4"
        />
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`mr-4 px-4 py-2 ${
            activeTab === "assignments"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } font-semibold rounded-lg`}
        >
          Assignments
        </button>
        <button
          onClick={() => setActiveTab("tests")}
          className={`px-4 py-2 ${
            activeTab === "tests"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } font-semibold rounded-lg`}
        >
          Tests
        </button>
      </div>

      {activeTab === "assignments" ? (
        <>
          <form
            onSubmit={handleCreateAssignment}
            className="mb-8 bg-white p-6 rounded-lg shadow-md border"
          >
            <h2 className="text-2xl font-semibold mb-4">Create Assignment</h2>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Title</label>
              <input
                type="text"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, title: e.target.value })
                }
                placeholder="Enter assignment title"
                required
                className="block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Description
              </label>
              <textarea
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    description: e.target.value,
                  })
                }
                placeholder="Enter assignment description"
                required
                className="block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    dueDate: e.target.value,
                  })
                }
                required
                className="block w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Create Assignment
            </button>
          </form>

          <h2 className="text-2xl font-semibold mb-4">Your Assignments</h2>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin w-12 h-12 text-blue-500" />
            </div>
          ) : localAssignments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {localAssignments.map((assignment: Assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-md border"
                >
                  <h3 className="text-lg font-semibold">{assignment.title}</h3>
                  <p className="text-gray-600">{assignment.description}</p>
                  <button
                    onClick={() => handleViewSubmissions(assignment.id)}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full"
                  >
                    View Submissions
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mt-3"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No Assignments</p>
          )}

          {selectedAssignmentId && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">
                Submissions for Assignment {selectedAssignmentId}
              </h3>
              {filteredSubmissions.length > 0 ? (
                <ul className="space-y-4">
                  {filteredSubmissions.map((submission: Submission) => (
                    <li
                      key={submission.id}
                      className="bg-white p-4 rounded-lg shadow-md border"
                    >
                      <p>
                        <strong>Student:</strong> {submission.student.name}
                      </p>
                      <p>
                        <strong>Content:</strong> {submission.content}
                      </p>
                      <div className="mt-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Score"
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          onChange={(e) => setScore(parseInt(e.target.value))}
                        />
                        <button
                          onClick={() => handleGrade(submission.id)}
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full"
                        >
                          Submit Grade
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No submissions found for this assignment.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <CreateQuizForm />
      )}
    </div>
  );
};

export default Assignment;

// const CreateTest = () => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold">Tests Management Coming Soon!</h2>
//       <p className="text-gray-600 mt-2">
//         You can create, view, and manage tests here once the feature is
//         available.
//       </p>
//     </div>
//   );
// };
