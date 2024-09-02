import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../function/Popup";
import { useAuth } from "@/api/useAuth";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const AddNotice: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, status, getresponse, error, addStuff, resetAuthStatus } =
    useAuth();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const adminID = currentUser?.user?.id;

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "notice";

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoader(true);
    const Id = toast.loading("Sending notice....");
    try {
      addStuff(fields, address);
    } catch (error: any) {
      toast.error(error || "An error occurred");
    } finally {
      toast.dismiss(Id);
    }
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/admin/notices");
      resetAuthStatus();
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      console.log(error);
    }
  }, [status, navigate, error, getresponse]);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
          onSubmit={submitHandler}
        >
          <h2 className="text-2xl font-bold mb-4">Add Notice</h2>

          <label className="block mb-2">Title</label>
          <input
            className="w-full p-2 mb-4 border rounded"
            type="text"
            placeholder="Enter notice title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label className="block mb-2">Details</label>
          <input
            className="w-full p-2 mb-4 border rounded"
            type="text"
            placeholder="Enter notice details..."
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            required
          />

          <label className="block mb-2">Date</label>
          <input
            className="w-full p-2 mb-4 border rounded"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />

          <button
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            type="submit"
            disabled={loader}
          >
            {loader ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              "Add"
            )}
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

export default AddNotice;
