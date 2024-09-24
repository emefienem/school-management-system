import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  BarChart,
  Table,
  ArrowLeft,
  Loader,
} from "lucide-react";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../function/AttendanceFunction";
import BarCharts from "../function/BarCharts";
import { useAuth } from "@/api/useAuth";
import { useNavigate } from "react-router";

const ViewStudentAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});
  const [selectedSection, setSelectedSection] = useState<"table" | "chart">(
    "table"
  );

  const { getUserDetails, userDetails, currentUser, loading, error } =
    useAuth();

  const ID = currentUser?.user?.id;
  const handleOpen = (subId: string) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  useEffect(() => {
    if (ID) {
      getUserDetails(ID, "student");
    }
  }, [ID]);

  const [subjectAttendance, setSubjectAttendance] = useState<[]>([]);

  useEffect(() => {
    if (userDetails?.attendance) {
      setSubjectAttendance(userDetails.attendance);
    }
  }, [userDetails]);

  const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);

  const subjectData = Object.entries(attendanceBySubject).map(
    ([subName, { present, sessions }]) => {
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
    }
  );

  interface DataType {
    date: string;
    status: string;
  }

  const handleSectionChange = (newSection: "table" | "chart") => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => {
    return (
      <>
        <h2 className="text-center text-2xl font-bold mb-4">Attendance</h2>
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Present</th>
              <th>Total Sessions</th>
              <th>Attendance Percentage</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendanceBySubject).map(
              ([subName, { present, allData, subId, sessions }], index) => {
                const subjectAttendancePercentage =
                  calculateSubjectAttendancePercentage(present, sessions);
                return (
                  // <React.Fragment key={index}>
                  //   <tr className="border-t">
                  //     <td>{subName}</td>
                  //     <td>{present}</td>
                  //     <td>{sessions}</td>
                  //     <td>{subjectAttendancePercentage}%</td>
                  //     <td className="text-center">
                  //       <button
                  //         className="flex items-end justify-end px-4 py-2 bg-blue-500 text-white rounded"
                  //         onClick={() => handleOpen(subId)}
                  //       >
                  //         {openStates[subId] ? (
                  //           <ChevronUp size={16} />
                  //         ) : (
                  //           <ChevronDown size={16} />
                  //         )}{" "}
                  //       </button>
                  //     </td>
                  //   </tr>
                  //   {openStates[subId] && (
                  //     <tr>
                  //       <td colSpan={5} className="p-4">
                  //         <div>
                  //           <h3 className="font-bold mb-2">
                  //             Attendance Details
                  //           </h3>
                  //           <table className="min-w-full table-auto">
                  //             <thead>
                  //               <tr>
                  //                 <th>Date</th>
                  //                 <th className="text-right">Status</th>
                  //               </tr>
                  //             </thead>
                  //             <tbody>
                  //               {allData.map(
                  //                 (data: DataType, index: number) => {
                  //                   const date = new Date(data.date);
                  //                   const dateString =
                  //                     date.toString() !== "Invalid Date"
                  //                       ? date.toISOString().substring(0, 10)
                  //                       : "Invalid Date";
                  //                   return (
                  //                     <tr key={index}>
                  //                       <td>{dateString}</td>
                  //                       <td className="text-right">
                  //                         {data.status}
                  //                       </td>
                  //                     </tr>
                  //                   );
                  //                 }
                  //               )}
                  //             </tbody>
                  //           </table>
                  //         </div>
                  //       </td>
                  //     </tr>
                  //   )}
                  // </React.Fragment>
                  <React.Fragment key={index}>
                    <tr className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2">{subName}</td>
                      <td className="px-4 py-2">{present}</td>
                      <td className="px-4 py-2">{sessions}</td>
                      <td className="px-4 py-2">
                        {subjectAttendancePercentage}%
                      </td>
                      <td className="text-center px-4 py-2 flex justify-center">
                        <button
                          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          onClick={() => handleOpen(subId)}
                        >
                          {openStates[subId] ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {openStates[subId] && (
                      <tr>
                        <td colSpan={5} className="p-4 bg-gray-100">
                          <div>
                            <h3 className="font-bold text-lg mb-2">
                              Attendance Details
                            </h3>
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                              <thead className="bg-gray-200">
                                <tr>
                                  <th className="px-4 py-2 text-left">Date</th>
                                  <th className="px-4 py-2 text-right">
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
                                      <tr key={index} className="border-t">
                                        <td className="px-4 py-2">
                                          {dateString}
                                        </td>
                                        <td className="text-right px-4 py-2">
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
                  </React.Fragment>
                );
              }
            )}
          </tbody>
        </table>
        <div className="mt-4">
          Overall Attendance Percentage:{" "}
          {overallAttendancePercentage.toFixed(2)}%
        </div>
      </>
    );
  };

  const renderChartSection = () => {
    return <BarCharts chartData={subjectData} dataKey="attendancePercentage" />;
  };
  return (
    <div className="container mx-auto px-4">
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
      ) : subjectAttendance && subjectAttendance.length > 0 ? (
        <>
          {selectedSection === "table" && renderTableSection()}
          {selectedSection === "chart" && renderChartSection()}

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-center">
            <button
              className={`px-4 py-2 mx-2 ${
                selectedSection === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              } rounded`}
              onClick={() => handleSectionChange("table")}
            >
              <Table className="inline-block mr-2" size={16} /> Table
            </button>
            <button
              className={`px-4 py-2 mx-2 ${
                selectedSection === "chart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              } rounded`}
              onClick={() => handleSectionChange("chart")}
            >
              <BarChart className="inline-block mr-2" size={16} /> Chart
            </button>
          </div>
        </>
      ) : (
        <h3 className="text-lg text-center">
          Currently You Have No Attendance Details
        </h3>
      )}
    </div>
  );
};

export default ViewStudentAttendance;
