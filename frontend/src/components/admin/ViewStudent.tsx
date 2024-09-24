import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Trash,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Table,
  PlusCircle,
} from "lucide-react";
import PieCharts from "../function/PieChart";
import BarCharts from "../function/BarCharts";
import Popup from "../function/Popup";
import { useAuth } from "@/api/useAuth";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../function/AttendanceFunction";

const ViewStudent: React.FC = () => {
  const [showTab, setShowTab] = useState<"details" | "table" | "chart">(
    "details"
  );

  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const {
    userDetails,
    getresponse,
    loading,
    error,
    getUserDetails,
    updateUser,
    removeAtten,
    getSubjectList,
    currentUser,
    deleteUser,
  } = useAuth();

  const studentID = params.id!;
  const address = "student";
  const ID = currentUser?.user?.id;
  useEffect(() => {
    getUserDetails(studentID, address);
    // console.log(userDetails);
  }, [studentID]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.sclass &&
      userDetails?.sclassId !== undefined
    ) {
      console.log(userDetails.sclassId);
      getSubjectList(ID, "subject");
    }
  }, [userDetails, ID]);

  if (getresponse) {
    console.log(getresponse);
  }

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [sclass, setSclass] = useState<{ sclassName: string }>({
    sclassName: "",
  });
  const [studentSchool, setStudentSchool] = useState<{ schoolName: string }>({
    schoolName: "",
  });
  const [subjectMarks, setSubjectMarks] = useState<Record<string, number>>({});
  const [subjectAttendance, setSubjectAttendance] = useState<[]>([]);

  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = (subId: string) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const fields =
    password === "" ? { name, rollNum } : { name, rollNum, password };

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setRollNum(userDetails.rollNum || "");
      setSclass(userDetails.sclass || "");
      setStudentSchool(userDetails.school || { schoolName: "" });
      setSubjectMarks(userDetails.examResults || {});
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    updateUser(fields, studentID, address)
      .then(() => {
        getUserDetails(studentID, address);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const deleteHandler = () => {
    setMessage("Sorry, the delete function has been disabled for now.");
    setShowPopup(true);
  };

  // const removeHandler = (id: string, deladdress: string) => {
  //   deleteUser(id, deladdress).then(() => {
  //     getUserDetails(studentID, address)
  //   })
  // };

  const removeSubAttendance = (subId: string) => {
    removeAtten(studentID, subId, "student").then(() => {
      getUserDetails(studentID, address);
    });
  };

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const subjectData = Object.entries(
    groupAttendanceBySubject(subjectAttendance)
  ).map(([subName, { subCode, present, sessions }]) => {
    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
      present,
      sessions
    );
    return {
      subject: subName,
      attendancePercentage: subjectAttendancePercentage,
      totalClasses: sessions,
      attendedClasses: present,
    };
  });

  interface DataType {
    date: string;
    status: string;
  }

  const StudentAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Attendance:</h3>
          {/* <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-200">
                <th className="py-2">Subject</th>
                <th className="py-2">Present</th>
                <th className="py-2">Total Sessions</th>
                <th className="py-2">Attendance Percentage</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
              ([subName, { present, allData, subId, sessions }], index) => {
                const subjectAttendancePercentage =
                  calculateSubjectAttendancePercentage(present, sessions);
                return (
                  <tbody key={index}>
                    <tr className="bg-gray-100">
                      <td className="py-2">{subName}</td>
                      <td className="py-2">{present}</td>
                      <td className="py-2">{sessions}</td>
                      <td className="py-2">{subjectAttendancePercentage}%</td>
                      <td className="py-2 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleOpen(subId)}
                        >
                          {openStates[subId] ? <ChevronUp /> : <ChevronDown />}{" "}
                          Details
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 ml-2"
                          onClick={() => removeSubAttendance(subId)}
                        >
                          <Trash />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 ml-2"
                          onClick={() =>
                            navigate(
                              `/admin/subject/student/attendance/${studentID}/${subId}`
                            )
                          }
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                    {openStates[subId] && (
                      <tr>
                        <td colSpan={5} className="py-2">
                          <div className="p-4 bg-gray-100">
                            <h4 className="text-sm font-semibold mb-2">
                              Attendance Details
                            </h4>
                            <table className="min-w-full bg-white">
                              <thead>
                                <tr className="w-full bg-gray-200">
                                  <th className="py-2">Date</th>
                                  <th className="py-2 text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allData.map(
                                  (data: DataType, index: number) => {
                                    const date = new Date(data.date);
                                    const dateString =
                                      date.toString() !== "Invalid Date"
                                        ? date.toISOString().substring(0, 10)
                                        : "Invalid Date";
                                    return (
                                      <tr key={index} className="bg-gray-100">
                                        <td className="py-2">{dateString}</td>
                                        <td className="py-2 text-right">
                                          {data.status}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              }
            )}
          </table> */}
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Subject
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Present
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Total Sessions
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Attendance Percentage
                </th>
                <th className="py-4 px-6 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
              ([subName, { present, allData, subId, sessions }], index) => {
                const subjectAttendancePercentage =
                  calculateSubjectAttendancePercentage(present, sessions);
                return (
                  <tbody key={index}>
                    <tr className="bg-gray-100 hover:bg-gray-50 transition duration-300">
                      <td className="py-4 px-6 text-sm font-medium text-gray-700">
                        {subName}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {present}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {sessions}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {subjectAttendancePercentage}%
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center space-x-4">
                          <button
                            className="text-blue-600 hover:text-blue-900 flex items-center transition-colors"
                            onClick={() => handleOpen(subId)}
                          >
                            {openStates[subId] ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}{" "}
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 transition-colors"
                            onClick={() => removeSubAttendance(subId)}
                          >
                            <Trash className="inline-block mr-1" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 transition-colors"
                            onClick={() =>
                              navigate(
                                `/admin/subject/student/attendance/${studentID}/${subId}`
                              )
                            }
                          >
                            Change
                          </button>
                        </div>
                      </td>
                    </tr>
                    {openStates[subId] && (
                      <tr>
                        <td colSpan={5} className="py-4 px-6">
                          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                            <h4 className="text-sm font-semibold mb-2 text-gray-700">
                              Attendance Details
                            </h4>
                            <table className="min-w-full bg-white border border-gray-200 rounded-md">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-600">
                                    Date
                                  </th>
                                  <th className="py-2 px-4 text-right text-xs font-medium text-gray-600">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {allData.map(
                                  (data: DataType, index: number) => {
                                    const date = new Date(data.date);
                                    const dateString =
                                      date.toString() !== "Invalid Date"
                                        ? date.toISOString().substring(0, 10)
                                        : "Invalid Date";
                                    return (
                                      <tr
                                        key={index}
                                        className="bg-white hover:bg-gray-50 transition duration-300"
                                      >
                                        <td className="py-2 px-4 text-sm text-gray-700">
                                          {dateString}
                                        </td>
                                        <td className="py-2 px-4 text-right text-sm text-gray-700">
                                          {data.status}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              }
            )}
          </table>
          <div className="mt-4">
            Overall Attendance Percentage:{" "}
            {overallAttendancePercentage.toFixed(2)}%
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="text-red-600 hover:text-red-900"
              onClick={() => deleteHandler()}
            >
              <Trash />
            </button>
            <button
              className="text-green-600 hover:text-green-900"
              onClick={() =>
                navigate("/Admin/students/student/attendance/" + studentID)
              }
            >
              <PlusCircle /> Add Attendance
            </button>
          </div>
        </div>
      );
    };

    const renderChartSection = () => {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Attendance Chart:</h3>
          <PieCharts data={chartData} />
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">
              Subject-wise Attendance:
            </h4>
            <BarCharts chartData={subjectData} dataKey="marksObtained" />
          </div>
        </div>
      );
    };

    return (
      <div>
        {subjectAttendance.length > 0 ? (
          <>
            {showTab === "details" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Overall Attendance:
                </h3>
                <div className="mb-4">
                  <p>
                    Overall Attendance Percentage:{" "}
                    {overallAttendancePercentage.toFixed(2)}%
                  </p>
                </div>
                {renderTableSection()}
              </div>
            )}
            {showTab === "table" && renderTableSection()}
            {showTab === "chart" && renderChartSection()}
            <div className="mt-4">
              <div className="flex space-x-4">
                <button
                  className={`p-2 ${
                    showTab === "table"
                      ? "font-semibold"
                      : "hover:font-semibold"
                  }`}
                  onClick={() => setShowTab("table")}
                >
                  <Table className="size-9" />
                </button>
                <button
                  className={`p-2 ${
                    showTab === "chart"
                      ? "font-semibold"
                      : "hover:font-semibold"
                  }`}
                  onClick={() => setShowTab("chart")}
                >
                  <BarChart2 className="size-9" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>No attendance records available.</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              // onChange={(e) => setName(e.target.value)}
              disabled
              placeholder="Name"
              className="border p-2 rounded-lg w-full"
            />
            <input
              type="text"
              value={rollNum}
              // onChange={(e) => setRollNum(e.target.value)}
              disabled
              placeholder="Roll Number"
              className="border p-2 rounded-lg w-full"
            />
          </div>
          <input
            type="text"
            value={sclass.sclassName}
            placeholder="Class Name"
            className="border p-2 rounded-lg w-full"
            disabled
          />
          <input
            type="text"
            value={studentSchool.schoolName}
            placeholder="School Name"
            className="border p-2 rounded-lg w-full"
            disabled
          />
          {/* <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Update Details
          </button> */}
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Subject Marks:</h3>
        {subjectMarks ? (
          // <table className="min-w-full bg-white">
          //   <thead>
          //     <tr className="bg-gray-200">
          //       <th className="py-2">Subject</th>
          //       <th className="py-2">Marks</th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {userDetails.examResults.map(
          //       (
          //         result: {
          //           subName: { subName: string };
          //           marksObtained: number;
          //         },
          //         index: number
          //       ) => (
          //         <tr key={index}>
          //           <td>{result.subName?.subName || "N/A"}</td>
          //           <td>{result.marksObtained || "N/A"}</td>
          //         </tr>
          //       )
          //     )}
          //   </tbody>
          // </table>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <th className="py-3 px-4 border-b border-gray-300">Subject</th>
                <th className="py-3 px-4 border-b border-gray-300">Marks</th>
              </tr>
            </thead>
            <tbody>
              {userDetails?.examResults?.map(
                (
                  result: {
                    subName: { subName: string };
                    marksObtained: number;
                  },
                  index: number
                ) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    <td className="py-3 px-4 border-b border-gray-200">
                      {result.subName?.subName || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      {result.marksObtained || "N/A"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <p>No subject marks available.</p>
        )}
      </div>

      <div className="mt-8">
        <StudentAttendanceSection />
      </div>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default ViewStudent;
