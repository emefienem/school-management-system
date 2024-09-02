import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../function/DataTable";
import { Car, BarChart, Loader, ArrowLeft } from "lucide-react";
import { useAuth } from "@/api/useAuth";

const ViewSubject: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ classID: string; subjectID: string }>();
  const {
    loading,
    subjectDetails,
    sclassStudents,
    getresponse,
    error,
    getClassStudents,
    getSubjectDetails,
  } = useAuth();

  const { classID, subjectID } = params;

  useEffect(() => {
    if (subjectID && classID) {
      getSubjectDetails(subjectID, "subject");
      getClassStudents(classID, "class");
      console.log(subjectDetails);
    }
  }, [subjectID, classID]);

  const [value, setValue] = useState<"details" | "students">("details");
  const [selectedSection, setSelectedSection] = useState<
    "attendance" | "marks"
  >("attendance");

  const handleTabChange = (newValue: "details" | "students") =>
    setValue(newValue);
  const handleSectionChange = (newSection: "attendance" | "marks") =>
    setSelectedSection(newSection);

  const studentColumns = [
    { id: "rollNum", label: "Roll No.", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student.id,
  }));

  const StudentsAttendanceButtonHaver: React.FC<{ row: { id: string } }> = ({
    row,
  }) => (
    <div className="flex space-x-2">
      <button onClick={() => navigate(`/admin/students/student/${row.id}`)}>
        View
      </button>
      <button
        onClick={() =>
          navigate(`/admin/subject/student/attendance/${row.id}/${subjectID}`)
        }
      >
        Take Attendance
      </button>
    </div>
  );

  const StudentsMarksButtonHaver: React.FC<{ row: { id: string } }> = ({
    row,
  }) => (
    <div className="flex space-x-2">
      <button onClick={() => navigate(`/admin/students/student/${row.id}`)}>
        View
      </button>
      <button
        onClick={() =>
          navigate(`/admin/subject/student/marks/${row.id}/${subjectID}`)
        }
      >
        Provide Marks
      </button>
    </div>
  );

  const SubjectStudentsSection: React.FC = () => (
    <div>
      {getresponse ? (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/admin/class/add-students/${classID}`)}
            className="bg-green-500 text-white px-4 py-2 rounded-xl"
          >
            Add Students
          </button>
        </div>
      ) : (
        <>
          <h5 className="text-lg font-bold mb-4">Students List:</h5>
          {selectedSection === "attendance" && (
            <TableTemplate
              buttonHaver={StudentsAttendanceButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
          )}
          {selectedSection === "marks" && (
            <TableTemplate
              buttonHaver={StudentsMarksButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
          )}

          <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
            <div className="flex justify-around">
              <button
                className={`text-center ${
                  selectedSection === "attendance" ? "text-blue-500" : ""
                }`}
                onClick={() => handleSectionChange("attendance")}
              >
                <Car className="mx-auto" />
                <span>Attendance</span>
              </button>
              <button
                className={`text-center ${
                  selectedSection === "marks" ? "text-blue-500" : ""
                }`}
                onClick={() => handleSectionChange("marks")}
              >
                <BarChart className="mx-auto" />
                <span>Marks</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const SubjectDetailsSection: React.FC = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <div className="text-center space-y-12">
        <h4 className="text-2xl font-bold mb-4 text-blue-500 text-start">
          Subject Details
        </h4>
        <p className="text-lg mb-2 uppercase font-bold">
          Subject Name:{" "}
          <span className="text-blue-500">
            {subjectDetails?.subName || "N/A"}
          </span>
        </p>
        <p className="text-lg mb-2 uppercase font-bold">
          Subject Code:{" "}
          <span className="text-blue-500">
            {subjectDetails?.subCode || "N/A"}
          </span>
        </p>
        <p className="text-lg mb-2 uppercase font-bold">
          Subject Sessions:{" "}
          <span className="text-blue-500">
            {subjectDetails?.sessions || "N/A"}
          </span>
        </p>
        <p className="text-lg mb-2 uppercase font-bold">
          Number of Students:{" "}
          <span className="text-blue-500">{numberOfStudents}</span>{" "}
        </p>
        <p className="text-lg mb-2 uppercase font-bold">
          Class Name:{" "}
          <span className="text-blue-500">
            {subjectDetails?.sclass?.sclassName || "N/A"}
          </span>
        </p>
        {subjectDetails?.teacher ? (
          <p className="text-lg mb-2">
            Teacher Name: {subjectDetails.teacher.name}
          </p>
        ) : (
          <button
            onClick={() =>
              navigate(`/admin/teachers/addteacher/${subjectDetails?.id}`)
            }
            className="bg-green-500 text-white px-4 py-2 rounded-xl"
          >
            Add Subject Teacher
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="text-center flex justify-center items-center py-4">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white mb-8"
          />

          <div className="flex justify-center items-center h-screen">
            <Loader className="animate-spin w-12 h-12 text-purple-600" />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="border-b border-gray-300">
            <div className="flex justify-center bg-white fixed w-full z-10">
              <button
                className={`px-4 py-2 ${
                  value === "details" ? "text-blue-500" : ""
                }`}
                onClick={() => handleTabChange("details")}
              >
                Details
              </button>
              <button
                className={`px-4 py-2 ${
                  value === "students" ? "text-blue-500" : ""
                }`}
                onClick={() => handleTabChange("students")}
              >
                Students
              </button>
            </div>
          </div>
          <div className="mt-16">
            {value === "details" && <SubjectDetailsSection />}
            {value === "students" && <SubjectStudentsSection />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubject;
