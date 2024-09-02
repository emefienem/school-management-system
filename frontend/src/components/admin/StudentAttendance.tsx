import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LucideLoader,
  LucideCheckCircle,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { useAuth } from "@/api/useAuth";

interface StudentAttendanceProps {
  situation: "Student" | "Subject";
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ situation }) => {
  const navigate = useNavigate();

  const {
    currentUser,
    getUserDetails,
    userDetails,
    getSubjectList,
    subjectsList,
    updateStudentFields,
    getresponse,
    error,
    status,
    loading,
  } = useAuth();

  const params = useParams<{
    id: string;
    subjectID?: string;
    studentID?: string;
  }>();

  const [studentID, setStudentID] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [chosenSubName, setChosenSubName] = useState<string>("");
  const [stat, setStat] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (situation === "Student") {
      setStudentID(params.id!);
      getUserDetails(params.id!, "student");
    } else if (situation === "Subject") {
      const { studentID, subjectID } = params;
      setStudentID(studentID!);
      getUserDetails(studentID!, "student");
      setChosenSubName(subjectID!);
    }
  }, [situation]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails?.sclass?.sclassName &&
      situation === "Student"
    ) {
      getSubjectList(userDetails.sclassId, "subject");
    }
  }, [userDetails]);

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = subjectsList.find(
      (subject: any) => subject.subName === event.target.value
    );
    setSubjectName(selectedSubject.subName);
    setChosenSubName(selectedSubject.id);
  };

  const fields = { subName: chosenSubName, stat, date };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);
    updateStudentFields(studentID, fields, "student");
  };

  useEffect(() => {
    if (getresponse) {
      setLoader(false);
      setShowPopup(true);
      setMessage(getresponse);
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("Error occurred");
    } else if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    }
  }, [getresponse, status, error]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
        <div className="w-full max-w-lg bg-white p-8 shadow-md rounded-lg">
          <div className="mb-6">
            <h4 className="text-xl font-semibold">
              Student Name: {userDetails.name}
            </h4>
            {currentUser?.teachSubject && (
              <h4 className="text-xl font-semibold mt-2">
                Subject Name: {currentUser?.teachSubject?.subName}
              </h4>
            )}
          </div>
          <form onSubmit={submitHandler}>
            {situation === "Student" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Subject
                </label>
                <select
                  value={subjectName}
                  onChange={changeHandler}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {subjectsList?.map((subject: any, index: number) => (
                    <option key={index} value={subject.subName}>
                      {subject.subName}
                    </option>
                  )) || (
                    <option value="Select Subject">
                      Add Subjects For Attendance
                    </option>
                  )}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Attendance stat
              </label>
              <select
                value={stat}
                onChange={(event) => setStat(event.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loader}
              className={`w-full py-2 px-4 text-white rounded-md shadow-md ${
                loader
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loader ? (
                <LucideLoader className="animate-spin" size={24} />
              ) : (
                "Submit"
              )}
            </button>
          </form>
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">{message}</h4>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPopup(false)}
                  >
                    <LucideCheckCircle size={24} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
