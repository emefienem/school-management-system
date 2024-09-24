import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../function/DataTable";
import { BookA, BarChart, Loader, ArrowLeft, EyeIcon } from "lucide-react";
import { useAuth } from "@/api/useAuth";

const ViewSubject: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ classID: string; subjectID: string }>();
  const {
    currentUser,
    loading,
    subjectDetails,
    sclassStudents,
    getresponse,
    error,
    getClassStudents,
    getSubjectDetails,
    sclassDetails,
  } = useAuth();

  const ID = currentUser?.user?.id;
  const { subjectID } = params;
  const classID = sclassDetails?.id;
  useEffect(() => {
    if (subjectID && classID) {
      getSubjectDetails(subjectID!, "subject");
      getClassStudents(classID!, "class");
      console.log(classID);
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

  const targetSclassId = subjectDetails?.sclassId;

  const filteredStudents = Array.isArray(sclassStudents)
    ? sclassStudents.map((student) => {
        let count = 0;

        const matchesStudentClass = student.sclassId === targetSclassId;
        if (matchesStudentClass) {
          count += 1;
        }

        const matchesEnrolledSubject =
          Array.isArray(student.enrollment) &&
          student.enrollment.some(
            (enrollment: { subject: any; sclassId: string }) =>
              enrollment.subject &&
              enrollment.subject.sclassId === targetSclassId
          );
        if (matchesEnrolledSubject) {
          count += 1;
        }

        return { ...student, count };
      })
    : [];

  const studentRows = filteredStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student.id,
  }));

  useEffect(() => {
    console.log(getresponse);
  });

  const StudentsAttendanceButtonHaver: React.FC<{ row: { id: string } }> = ({
    row,
  }) => (
    <div className="flex space-x-6 xl:ml-52">
      <button onClick={() => navigate(`/admin/students/student/${row.id}`)}>
        <EyeIcon className="text-blue-500" />
      </button>
      <button
        onClick={() => navigate(`/admin/students/student/attendance/${row.id}`)}
        className="bg-black text-white px-4 py-2"
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
      {filteredStudents.length === 0 ? (
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
                <BookA className="mx-auto" />
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
    const targetSclassId = subjectDetails?.sclassId;

    const filteredStudents = Array.isArray(sclassStudents)
      ? sclassStudents.map((student) => {
          let count = 0;

          if (student.sclassId === targetSclassId) {
            count += 1;
          }

          if (
            Array.isArray(student.enrollment) &&
            student.enrollment.some(
              (enrollment: { subject: any; sclassId: string }) =>
                enrollment.subject.sclassId === targetSclassId
            )
          ) {
            count += 1;
          }

          return { ...student, count };
        })
      : [];

    const numberOfStudents = filteredStudents.reduce(
      (total, student) => total + student.count,
      0
    );

    return (
      <div className="overflow-x-auto">
        <h4 className="text-2xl font-bold mb-4 text-blue-500 text-start">
          Subject Details
        </h4>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left text-gray-600 font-bold">
                Attribute
              </th>
              <th className="py-2 px-4 border-b text-left text-gray-600 font-bold">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b text-gray-800 font-bold">
                Subject Name
              </td>
              <td className="py-2 px-4 border-b text-blue-500">
                {subjectDetails?.subName || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-gray-800 font-bold">
                Subject Code
              </td>
              <td className="py-2 px-4 border-b text-blue-500">
                {subjectDetails?.subCode || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-gray-800 font-bold">
                Subject Sessions
              </td>
              <td className="py-2 px-4 border-b text-blue-500">
                {subjectDetails?.sessions || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-gray-800 font-bold">
                Number of Students
              </td>
              <td className="py-2 px-4 border-b text-blue-500">
                {numberOfStudents}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-gray-800 font-bold">
                Class Name
              </td>
              <td className="py-2 px-4 border-b text-blue-500">
                {subjectDetails?.sclass?.sclassName || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-gray-800 font-bold">
                Teacher Name
              </td>
              <td className="py-2 px-4 border-b text-orange-500">
                {subjectDetails?.teacher ? (
                  subjectDetails.teacher.name
                ) : (
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/teachers/addteacher/${subjectDetails?.id}`
                      )
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-xl"
                  >
                    Add Subject Teacher
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
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
