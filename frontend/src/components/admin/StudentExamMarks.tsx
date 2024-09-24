import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Popup from "../function/Popup";
import { Loader } from "lucide-react";
import { useAuth } from "@/api/useAuth";

interface StudentExamMarksProps {
  situation: string;
}

const StudentExamMarks: React.FC<StudentExamMarksProps> = ({ situation }) => {
  const {
    currentUser,
    getSubjectList,
    subjectsList,
    getUserDetails,
    userDetails,
    updateExamResults,
    loading,
    getresponse,
    error,
    getstatus,
  } = useAuth();
  const params = useParams<{
    id: string;
    studentID?: string;
    subjectID?: string;
  }>();

  const [studentID, setStudentID] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [chosenSubName, setChosenSubName] = useState<string>("");
  const [marksObtained, setMarksObtained] = useState<string>("");

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (situation === "Student") {
      setStudentID(params.id || "");
      const stdID = params.id || "";
      getUserDetails(stdID, "student");
    } else if (situation === "Subject") {
      const { studentID, subjectID } = params;
      setStudentID(studentID || "");
      getUserDetails(studentID || "", "student");
      setChosenSubName(subjectID || "");
    }
  }, [situation, params]);

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === "Student") {
      getSubjectList(userDetails.sclassName.id, "subject");
    }
  }, [userDetails, situation]);

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = subjectsList.find(
      (subject: any) => subject.subName === event.target.value
    );
    if (selectedSubject) {
      setSubjectName(selectedSubject.subName);
      setChosenSubName(selectedSubject.id);
    }
  };

  const fields = { subName: chosenSubName, marksObtained };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoader(true);
    updateExamResults(studentID, fields, "student");
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
    } else if (getstatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    }
  }, [getresponse, getstatus, error]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-lg w-full bg-white p-8 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Student Name: {userDetails?.name || "Loading..."}
              </h2>
              {currentUser.teachSubject && (
                <h2 className="text-xl font-semibold mb-4">
                  Subject Name: {currentUser.teachSubject?.subName}
                </h2>
              )}
              <form onSubmit={submitHandler}>
                {situation === "Student" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Select Subject
                    </label>
                    <select
                      value={subjectName}
                      onChange={changeHandler}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                      required
                    >
                      {subjectsList?.map((subject: any, index: number) => (
                        <option key={index} value={subject.subName}>
                          {subject.subName}
                        </option>
                      )) || (
                        <option value="Select Subject">
                          Add Subjects For Marks
                        </option>
                      )}
                    </select>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Enter Marks
                  </label>
                  <input
                    type="number"
                    value={marksObtained}
                    onChange={(e) => setMarksObtained(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  disabled={loader}
                >
                  {loader ? (
                    <Loader className="animate-spin w-5 h-5 inline-block" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>
          </div>
          {showPopup && (
            <Popup
              message={message}
              setShowPopup={setShowPopup}
              showPopup={showPopup}
            />
          )}
        </>
      )}
    </>
  );
};

export default StudentExamMarks;
