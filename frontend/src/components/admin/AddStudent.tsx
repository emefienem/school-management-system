import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../function/Popup";
import { Loader } from "lucide-react";
import { useAuth } from "@/api/useAuth";

interface AddStudentProps {
  situation: "Class" | "Student";
}

const AddStudent: React.FC<AddStudentProps> = ({ situation }) => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const {
    status,
    currentUser,
    getresponse,
    sclasses,
    getAllSclasses,
    resetAuthStatus,
    register,
  } = useAuth();

  const [name, setName] = useState<string>("");
  const [rollNum, setRollNum] = useState<number | undefined>(undefined);
  const [password, setPassword] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [sclassName, setSclassName] = useState<string>("");

  const adminID = currentUser?.user?.id;
  // const attendance: any[] = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id || "");
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (adminID) {
      getAllSclasses(adminID, "class");
    }
  }, [adminID]);

  const changeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class");
      setSclassName("");
    } else {
      const selectedClass = sclasses.find(
        (classItem) => classItem.sclassName === event.target.value
      );
      if (selectedClass) {
        setClassName(selectedClass.sclassName);
        setSclassName(selectedClass.id);
      }
    }
  };

  const fields = {
    name,
    rollNum,
    password,
    // sclassName,
    adminID,
    // attendance,
    sclassId: parseInt(sclassName, 10),
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sclassName === "") {
      setMessage("Please select a classname");
      setShowPopup(true);
    } else {
      setLoader(true);
      register(fields, "student");
    }
  };

  useEffect(() => {
    if (status === "added") {
      resetAuthStatus();
      navigate(-1);
    } else if (status === "failed") {
      setMessage(getresponse ?? "An error occurred");
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, getresponse]);

  const handleRollNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setRollNum(isNaN(value) ? undefined : value); // Set undefined if the input is not a valid number
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
          onSubmit={submitHandler}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Add Student
          </h2>

          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="text"
            placeholder="Enter student's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          {situation === "Student" && (
            <>
              <label className="block mt-4 text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={className}
                onChange={changeHandler}
                required
              >
                <option value="Select Class">Select Class</option>
                {sclasses.map((classItem, index) => (
                  <option key={index} value={classItem.sclassName}>
                    {classItem.sclassName}
                  </option>
                ))}
              </select>
            </>
          )}

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Roll Number
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="number"
            placeholder="Enter student's Roll Number..."
            value={rollNum ?? ""}
            onChange={handleRollNumChange}
            required
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="password"
            placeholder="Enter student's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
            disabled={loader}
          >
            {loader ? <Loader className="animate-spin" size={24} /> : "Add"}
          </button>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddStudent;
