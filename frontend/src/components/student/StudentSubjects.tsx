import React, { useEffect, useState } from "react";
import BarCharts from "../function/BarCharts";
import { ArrowLeft, BarChart, Loader, Table as TableIcon } from "lucide-react";
import { useAuth } from "@/api/useAuth";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

interface Score {
  id: string;
  assignment: {
    title: string;
  };
  score: number;
}

const StudentSubjects: React.FC = () => {
  const navigate = useNavigate();
  const {
    getUserDetails,
    userDetails,
    currentUser,
    getSubjectList,
    subjectsList,
    getClassDetails,
    sclassDetails,
    dropSubject,
    loading,
    getresponse,
    error,
    getEnrolledSubjects,
    enrolledSubjects,
    getAvailableSubjects,
    getScores,
    scores,
  } = useAuth();
  const classID = currentUser?.user?.sclassId;
  const subjectID = currentUser?.user?.schoolId;

  const ID = currentUser?.user?.id;
  const studentId = currentUser?.user?.id;

  useEffect(() => {
    getClassDetails(classID, "class");
    getUserDetails(ID, "student");
    getSubjectList(subjectID, "subject");
    getEnrolledSubjects(studentId);
    getScores(ID);
  }, [ID]);

  if (getresponse) {
    console.log(getresponse);
  }

  const [subjectMarks, setSubjectMarks] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<"table" | "chart">(
    "table"
  );

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResults || []);
    }
  }, [userDetails]);

  useEffect(() => {
    // if (subjectMarks.length === 0) {
    // }
  }, [subjectMarks, currentUser?.user?.id]);

  const handleSectionChange = (newSection: "table" | "chart") => {
    setSelectedSection(newSection);
  };

  const renderAssignmentDetails = () => {
    return (
      <div className="overflow-x-auto pb-20">
        <h2 className="text-2xl font-semibold text-center my-4">
          Your Assignment
        </h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-gray-700 font-bold">
                Assignment Title
              </th>
              <th className="px-6 py-3 border-b text-left text-gray-700 font-bold">
                Assignment Score
              </th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? (
              scores.map((score: Score, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 border-b text-gray-800 ">
                    {score.assignment.title}
                  </td>
                  <td className="px-6 py-4 border-b text-gray-800 ">
                    {score.score}
                  </td>
                </tr>
              ))
            ) : (
              <p className="text-gray-500">No scores available yet.</p>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEnrolledSubjectsTable = () => {
    const handleDropSubject = async (subjectId: string) => {
      try {
        await dropSubject(ID, subjectId);

        await getAvailableSubjects(studentId);
      } catch (error: any) {
        toast.error(error.message, { duration: 4000 });
      }
    };
    return (
      <div className="overflow-x-auto pb-20">
        <h2 className="text-2xl font-semibold text-center my-4">
          Enrolled Subjects
        </h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-gray-700 font-bold">
                Subject Name
              </th>
              <th className="px-6 py-3 border-b text-left text-gray-700 font-bold">
                Subject Code
              </th>
              <th className="py-2 px-4 border-b text-gray-600 font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {enrolledSubjects.length > 0 ? (
              enrolledSubjects.map((enrollment, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 border-b text-gray-800 ">
                    {enrollment.subject.subName}
                  </td>
                  <td className="px-6 py-4 border-b text-gray-800 ">
                    {enrollment.subject.subCode}
                  </td>
                  <td className="py-2 px-4 border-b text-blue-500 text-center">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:underline"
                      onClick={() => handleDropSubject(enrollment.subject.id)}
                    >
                      Drop
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-600">
                  No enrolled subjects
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTableSection = () => (
    <>
      <h2 className="text-2xl font-semibold text-center my-4 text-blue-500">
        Subject Marks
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-gray-700 font-bold">
                Subject
              </th>
              <th className="px-6 py-3 border-b text-left text-gray-700 font-bold">
                Marks
              </th>
            </tr>
          </thead>
          <tbody>
            {subjectMarks.length > 0 ? (
              subjectMarks.map((result, index) => {
                if (!result.subName || !result.marksObtained) {
                  return null;
                }
                return (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 border-b text-gray-800">
                      {result.subName.subName}
                    </td>
                    <td className="px-6 py-4 border-b text-gray-800">
                      {result.marksObtained}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-600">
                  No marks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderChartSection = () => (
    <BarCharts chartData={subjectMarks} dataKey="marksObtained" />
  );

  const renderClassDetailsSection = () => {
    const filteredSubjects = subjectsList.filter(
      (subject) => subject?.sclassId === userDetails?.sclassId
    );
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center my-4">
          Class Details
        </h2>

        <h3 className="text-xl font-medium mb-4 text-center">
          You are currently in class:{" "}
          <span className="text-blue-500 font-bold">
            {sclassDetails?.sclassName || "N/A"}
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-gray-600 font-bold">
                  Subject Name
                </th>
                <th className="py-2 px-4 border-b text-gray-600 font-bold">
                  Subject Code
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects && filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-blue-500">
                      {subject.subName}
                    </td>
                    <td className="py-2 px-4 border-b text-blue-500">
                      {subject.subCode}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-2 px-4 border-b text-gray-600">
                    No subjects available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <>
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white mb-8"
          />
          <div className="text-center flex justify-center items-center py-4">
            <div className="flex justify-center items-center h-screen">
              <Loader className="animate-spin w-12 h-12 text-purple-600" />
            </div>
          </div>
        </>
      ) : (
        <div>
          {subjectMarks &&
          Array.isArray(subjectMarks) &&
          subjectMarks.length > 0 ? (
            <>
              {selectedSection === "table" && renderTableSection()}
              {selectedSection === "chart" && renderChartSection()}

              <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
                <div className="flex justify-around py-2">
                  <button
                    className={`flex items-center justify-center px-4 py-2 ${
                      selectedSection === "table"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                    onClick={() => handleSectionChange("table")}
                  >
                    <TableIcon className="w-6 h-6" />
                    <span className="ml-2">Table</span>
                  </button>
                  <button
                    className={`flex items-center justify-center px-4 py-2 ${
                      selectedSection === "chart"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                    onClick={() => handleSectionChange("chart")}
                  >
                    <BarChart className="w-6 h-6" />
                    <span className="ml-2">Chart</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            "No mark available"
          )}
        </div>
      )}
      <>
        {renderClassDetailsSection()}
        {renderEnrolledSubjectsTable()}
        {renderAssignmentDetails()}
      </>
    </>
  );
};

export default StudentSubjects;
