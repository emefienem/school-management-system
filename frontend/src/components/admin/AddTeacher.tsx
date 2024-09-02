import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../function/Popup";
import { Loader } from "lucide-react";
import { useAuth } from "@/api/useAuth";

type Params = Record<string, string | undefined>;

const AddTeacher: React.FC = () => {
  const params = useParams<Params>();
  const navigate = useNavigate();

  const subjectID = params.id;

  const {
    register,
    getSubjectDetails,
    subjectDetails,
    status,
    getresponse,
    error,
    resetAuthStatus,
  } = useAuth();

  useEffect(() => {
    if (subjectID) {
      getSubjectDetails(subjectID, "subject");
    }
  }, [subjectID]);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  const role = "teacher";
  const school = subjectDetails?.school;
  const schoolId = subjectDetails?.schoolId;
  const teachSubjectId = subjectDetails?.id;
  const teachSclassId = subjectDetails?.sclassId;

  const fields = {
    name,
    email,
    password,
    role,
    school,
    schoolId,
    teachSubjectId,
    teachSclassId,
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoader(true);
    register(fields, role);
  };

  useEffect(() => {
    if (status === "added") {
      resetAuthStatus();
      navigate("/admin/teachers");
    } else if (status === "failed") {
      setMessage(getresponse as string);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, getresponse]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <form onSubmit={submitHandler}>
          <h2 className="text-2xl font-bold mb-6">Add Teacher</h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Subject: {subjectDetails?.subName}
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class: {subjectDetails?.sclass?.sclassName}
            </label>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter teacher's name..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter teacher's email..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter teacher's password..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loader ? "cursor-not-allowed" : ""
              }`}
              disabled={loader}
            >
              {loader ? (
                <Loader className="animate-spin" size={24} color="white" />
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default AddTeacher;
