import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../function/Popup";
import { ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "@/api/useAuth";

interface AddParentProps {
  situation: "Parent";
}

const AddParent: React.FC<AddParentProps> = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const {
    getstatus,
    currentUser,
    getresponse,
    studentsList,
    getAllStudents,
    resetAuthStatus,
    register,
  } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //   const [studentId, setStudentId] = useState<number | undefined>(undefined);
  const [studentIds, setStudentIds] = useState<number[]>([]);

  const ID = currentUser?.user?.id;

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (ID) {
      getAllStudents(ID);
    }
  }, [ID]);

  const changeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(event.target.selectedOptions).map((option) =>
      parseInt(option.value, 10)
    );
    setStudentIds(selectedIds);
  };

  const fields = {
    name,
    email,
    password,
    studentIds,
    schoolId: ID,
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (studentIds.length === 0) {
      setMessage("Please select at least one student to link to the parent.");
      setShowPopup(true);
    } else {
      setLoader(true);
      register(fields, "parent");
    }
  };

  useEffect(() => {
    if (getstatus === "added") {
      resetAuthStatus();
      navigate(-1); // Go back after success
    } else if (getstatus === "failed") {
      setMessage(getresponse ?? "An error occurred");
      setShowPopup(true);
      setLoader(false);
    } else if (getstatus === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [getstatus, navigate, getresponse]);

  return (
    <>
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white mb-8"
      />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
          onSubmit={submitHandler}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Add Parent
          </h2>

          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="text"
            placeholder="Enter parent's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="email"
            placeholder="Enter parent's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="password"
            placeholder="Enter parent's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Link to Student(s)
          </label>
          <select
            multiple
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={studentIds.map((id) => id.toString())}
            onChange={changeHandler}
            required
          >
            {studentsList.map((student) => (
              <option key={student.id} value={student.id.toString()}>
                {student.name}
              </option>
            ))}
          </select>

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

export default AddParent;
