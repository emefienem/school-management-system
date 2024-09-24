import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Loader } from "lucide-react";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../function/AttendanceFunction";
import PieChart from "../function/PieChart";
import { useAuth } from "@/api/useAuth";

const TeacherViewStudent: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser, getUserDetails, userDetails, loading, error } =
    useAuth();

  const studentID = params.id!;
  const teachSubject = currentUser?.user?.teachSubject?.subName;
  const teachSubjectID = currentUser?.user?.teachSubjectId;

  useEffect(() => {
    getUserDetails(studentID, "student");
  }, [studentID]);

  const [sclass, setSclass] = useState<{ sclassName: string }>({
    sclassName: "",
  });
  const [studentSchool, setStudentSchool] = useState<{ schoolName: string }>({
    schoolName: "",
  });
  const [subjectMarks, setSubjectMarks] = useState<any[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<any[]>([]);
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  const handleOpen = (subId: string) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  useEffect(() => {
    if (userDetails) {
      setSclass(userDetails?.sclass || "");
      setStudentSchool(userDetails?.school || { schoolName: "" });
      setSubjectMarks(userDetails?.examResults || {});
      setSubjectAttendance(userDetails?.attendance || []);
    }
  }, [userDetails]);

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

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
        <div className="container mx-auto p-4">
          <>
            <div className="container mx-auto mt-8">
              <h1 className="text-2xl font-semibold mb-4">Student Details</h1>
              <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-gray-700 font-bold">
                      Detail
                    </th>
                    <th className="px-4 py-2 border-b text-left text-gray-700 font-bold">
                      Information
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 border-b text-gray-800">Name</td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {userDetails?.name}
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 border-b text-gray-800">
                      Roll Number
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {userDetails?.rollNum}
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 border-b text-gray-800">Class</td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {sclass.sclassName}
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 border-b text-gray-800">School</td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {studentSchool?.schoolName}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold">Attendance</h3>
              {subjectAttendance && subjectAttendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-bold">
                          Subject
                        </th>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-bold">
                          Present
                        </th>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-bold">
                          Total Sessions
                        </th>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-bold">
                          Attendance Percentage
                        </th>
                        <th className="px-4 py-2 border-b text-left text-gray-700 font-bold">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        groupAttendanceBySubject(subjectAttendance)
                      ).map(
                        (
                          [subName, { present, allData, subId, sessions }],
                          index
                        ) => {
                          if (subName === teachSubject) {
                            const subjectAttendancePercentage =
                              calculateSubjectAttendancePercentage(
                                present,
                                sessions
                              );

                            return (
                              <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 py-2 border-b text-gray-800">
                                  {subName}
                                </td>
                                <td className="px-4 py-2 border-b text-gray-800">
                                  {present}
                                </td>
                                <td className="px-4 py-2 border-b text-gray-800">
                                  {sessions}
                                </td>
                                <td className="px-4 py-2 border-b text-gray-800">
                                  {subjectAttendancePercentage}%
                                </td>
                                <td className="px-4 py-2 border-b text-gray-800">
                                  <button
                                    onClick={() => handleOpen(subId)}
                                    className="text-gray-600 flex items-center space-x-1"
                                  >
                                    {openStates[subId] ? (
                                      <ChevronUp />
                                    ) : (
                                      <ChevronDown />
                                    )}{" "}
                                  </button>
                                </td>
                              </tr>
                            );
                          } else {
                            return null;
                          }
                        }
                      )}
                    </tbody>
                  </table>

                  {Object.entries(
                    groupAttendanceBySubject(subjectAttendance)
                  ).map(([subName, { allData, subId }]) => {
                    if (openStates[subId]) {
                      return (
                        <div key={subId} className="mt-2 border-t pt-4">
                          <h4 className="font-medium">
                            Attendance Details for {subName}
                          </h4>
                          <ul>
                            {allData.map((data: any, idx: number) => {
                              const date = new Date(data.date);
                              const dateString = !isNaN(date.getTime())
                                ? date.toISOString().substring(0, 10)
                                : "Invalid Date";
                              return (
                                <li key={idx} className="flex justify-between">
                                  <span>{dateString}</span>
                                  <span>{data.status}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  })}

                  <div className="mt-4">
                    <p>
                      Overall Attendance Percentage:{" "}
                      {overallAttendancePercentage.toFixed(2)}%
                    </p>
                    <PieChart data={chartData} />
                  </div>
                </div>
              ) : (
                <p>No attendance data available</p>
              )}
            </div>
          </>

          <div className="mt-8">
            <button
              onClick={() =>
                navigate(
                  `/teacher/class/student/attendance/${studentID}/${teachSubjectID}`
                )
              }
              className="bg-purple-600 text-white py-2 px-4 rounded-lg"
            >
              Add Attendance
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Subject Marks
            </h3>
            {subjectMarks && subjectMarks.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b text-left text-gray-700">
                      Subject
                    </th>
                    <th className="px-4 py-2 border-b text-left text-gray-700">
                      Marks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjectMarks.map((result, index) => {
                    if (result.subName?.subName === teachSubject) {
                      return (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2 border-b text-gray-800">
                            {result.subName?.subName}
                          </td>
                          <td className="px-4 py-2 border-b text-gray-600">
                            {result.marksObtained}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No marks data available</p>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={() =>
                navigate(
                  `/teacher/class/student/marks/${studentID}/${teachSubjectID}`
                )
              }
              className="bg-purple-600 text-white py-2 px-4 rounded-lg"
            >
              Add Marks
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherViewStudent;
