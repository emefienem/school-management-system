import React, { useEffect, useState } from "react";
import BarCharts from "../function/BarCharts";
import { ArrowLeft, BarChart, Loader, Table as TableIcon } from "lucide-react";
import { useAuth } from "@/api/useAuth";
import { useNavigate, useParams } from "react-router";

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
    loading,
    getresponse,
    error,
  } = useAuth();
  const classID = currentUser?.user?.sclassId;
  const subjectID = currentUser?.user?.schoolId;

  const ID = currentUser?.user?.id;
  useEffect(() => {
    getClassDetails(classID, "class");
    getUserDetails(ID, "student");
    getSubjectList(subjectID, "subject");
  }, [ID]);

  if (getresponse) {
    console.log(getresponse);
  } else if (error) {
    console.log(error);
  }

  const [subjectMarks, setSubjectMarks] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<"table" | "chart">(
    "table"
  );

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    // if (subjectMarks.length === 0) {
    // }
  }, [subjectMarks, currentUser?.user?.id]);

  const handleSectionChange = (newSection: "table" | "chart") => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => (
    <>
      <h2 className="text-2xl font-semibold text-center my-4">Subject Marks</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Subject</th>
            <th className="px-4 py-2 border-b">Marks</th>
          </tr>
        </thead>
        <tbody>
          {subjectMarks.map((result, index) => {
            if (!result.subName || !result.marksObtained) {
              return null;
            }
            return (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 border-b">{result.subName.subName}</td>
                <td className="px-4 py-2 border-b">{result.marksObtained}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

  const renderChartSection = () => (
    <BarCharts chartData={subjectMarks} dataKey="marksObtained" />
  );

  const renderClassDetailsSection = () => (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold text-center my-4">Class Details</h2>
      <h3 className="text-xl font-medium mb-4">
        You are currently in class: {sclassDetails && sclassDetails.sclassName}
      </h3>
      <h4 className="text-lg font-medium mb-2">The subjects:</h4>
      {subjectsList &&
        subjectsList.map((subject, index) => (
          <p key={index} className="text-base">
            {subject.subName} ({subject.subCode})
          </p>
        ))}
    </div>
  );

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
            renderClassDetailsSection()
          )}
        </div>
      )}
    </>
  );
};

export default StudentSubjects;
