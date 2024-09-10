import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
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
      setSubjectMarks(userDetails?.examResult || {});
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
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="container mx-auto p-4">
          <h1 className="text-xl font-bold mb-2">{userDetails?.name}</h1>
          <p>Roll Number: {userDetails?.rollNum}</p>
          <p>Class: {sclass.sclassName}</p>
          <p>School: {studentSchool?.schoolName}</p>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Attendance</h3>
            {subjectAttendance && subjectAttendance.length > 0 ? (
              <>
                {Object.entries(
                  groupAttendanceBySubject(subjectAttendance)
                ).map(
                  ([subName, { present, allData, subId, sessions }], index) => {
                    if (subName === teachSubject) {
                      const subjectAttendancePercentage =
                        calculateSubjectAttendancePercentage(present, sessions);

                      return (
                        <div key={index} className="my-4 border-b pb-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p>Subject: {subName}</p>
                              <p>Present: {present}</p>
                              <p>Total Sessions: {sessions}</p>
                              <p>
                                Attendance Percentage:{" "}
                                {subjectAttendancePercentage}%
                              </p>
                            </div>
                            <button
                              onClick={() => handleOpen(subId)}
                              className="text-gray-600 flex items-center space-x-1"
                            >
                              {openStates[subId] ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )}{" "}
                              Details
                            </button>
                          </div>
                          {openStates[subId] && (
                            <div className="mt-2">
                              <h4 className="font-medium">
                                Attendance Details
                              </h4>
                              <ul>
                                {allData.map((data: any, idx: number) => {
                                  const date = new Date(data.date);
                                  const dateString = !isNaN(date.getTime())
                                    ? date.toISOString().substring(0, 10)
                                    : "Invalid Date";
                                  return (
                                    <li
                                      key={idx}
                                      className="flex justify-between"
                                    >
                                      <span>{dateString}</span>
                                      <span>{data.status}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  }
                )}

                <div className="mt-4">
                  <p>
                    Overall Attendance Percentage:{" "}
                    {overallAttendancePercentage.toFixed(2)}%
                  </p>
                  <PieChart data={chartData} />
                </div>
              </>
            ) : (
              <p>No attendance data available</p>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() =>
                navigate(
                  `/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`
                )
              }
              className="bg-purple-600 text-white py-2 px-4 rounded-lg"
            >
              Add Attendance
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Subject Marks</h3>
            {subjectMarks && subjectMarks.length > 0 ? (
              <div>
                {subjectMarks.map((result, index) => {
                  if (result.subName?.subName === teachSubject) {
                    return (
                      <div key={index} className="my-4 border-b pb-4">
                        <p>Subject: {result.subName?.subName}</p>
                        <p>Marks: {result.marksObtained}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <p>No marks data available</p>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={() =>
                navigate(
                  `/Teacher/class/student/marks/${studentID}/${teachSubjectID}`
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
