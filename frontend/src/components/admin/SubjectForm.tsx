import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../function/Popup";
import { PlusCircle, XCircle } from "lucide-react";
import { useAuth } from "@/api/useAuth";

interface Subject {
  subName: string;
  subCode: string;
  sessions: number | string;
}

const SubjectForm: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      subName: "",
      subCode: "",
      sessions: "",
    },
  ]);

  const navigate = useNavigate();
  const params = useParams();

  const { status, currentUser, getresponse, error, resetAuthStatus, addStuff } =
    useAuth();

  const sclassName = params.id || "";
  const adminID = currentUser.user.id;

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  const handleSubjectNameChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const newSubjects = [...subjects];
      newSubjects[index].subName = event.target.value;
      setSubjects(newSubjects);
    };

  const handleSubjectCodeChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const newSubjects = [...subjects];
      newSubjects[index].subCode = event.target.value;
      setSubjects(newSubjects);
    };

  const handleSessionsChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const newSubjects = [...subjects];
      newSubjects[index].sessions = event.target.value || 0;
      setSubjects(newSubjects);
    };

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      {
        subName: "",
        subCode: "",
        sessions: "",
      },
    ]);
  };

  const handleRemoveSubject = (index: number) => () => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const fields = {
    sclassName: sclassName,
    subjects: subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions,
      sclassId: parseInt(sclassName), // IDK
    })),
    adminID,
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoader(true);
    addStuff(fields, "subject");
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/admin/subjects");
      resetAuthStatus();
      setLoader(false);
    } else if (status === "failed") {
      setMessage(getresponse ?? "An error occurred");
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, getresponse]);

  return (
    <form onSubmit={submitHandler} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Add Subjects</h2>
      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700">Subject Name</label>
              <input
                type="text"
                value={subject.subName}
                onChange={handleSubjectNameChange(index)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Subject Code</label>
              <input
                type="text"
                value={subject.subCode}
                onChange={handleSubjectCodeChange(index)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Sessions</label>
              <input
                type="number"
                min="0"
                value={subject.sessions}
                onChange={handleSessionsChange(index)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="flex items-end">
              {index === 0 ? (
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="text-blue-500 hover:underline"
                >
                  <PlusCircle className="inline mr-2" /> Add Subject
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveSubject(index)}
                  className="text-red-500 hover:underline"
                >
                  <XCircle className="inline mr-2" /> Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loader}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          {loader ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V7a1 1 0 00-1-1H4zm6 0a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V7a1 1 0 00-1-1h-2zM4 11a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H4zm6 0a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2zM4 16a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H4zm6 0a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2z"
              />
            </svg>
          ) : (
            "Save"
          )}
        </button>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </form>
  );
};

export default SubjectForm;
