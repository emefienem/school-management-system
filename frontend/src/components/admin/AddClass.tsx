import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Popup from "../function/Popup";
import { Loader } from "lucide-react";
import Classroom from "../../assets/classroom.png";
import { useAuth } from "@/api/useAuth";
import { toast } from "sonner";
interface DetailsType {
  id: string;
}
const AddClass: React.FC = () => {
  const [sclassName, setSclassName] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const navigate = useNavigate();
  const {
    getstatus,
    currentUser,
    getresponse,
    error,
    details,
    addStuff,
    resetAuthStatus,
  } = useAuth();

  const adminID = currentUser?.user?.id;
  const address = "class";

  const fields = {
    sclassName,
    adminID,
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoader(true);
    const Id = toast.loading("Adding class....");
    try {
      addStuff(fields, address);
    } catch (error: any) {
      toast.error(error || "An error occurred");
    } finally {
      toast.dismiss(Id);
    }
  };

  useEffect(() => {
    if (getstatus === "added" && details) {
      toast.success("Added the class");
      if (Array.isArray(details)) {
        if (details.length > 0 && details[0]?.id) {
          navigate("/admin/classes/class/" + details[0].id);
        } else {
          setMessage("Unexpected response format.");
          setShowPopup(true);
        }
      } else if ((details as DetailsType).id) {
        navigate("/admin/classes/class/" + (details as DetailsType).id);
      }
      resetAuthStatus();
      setLoader(false);
    } else if (getstatus === "failed") {
      setMessage(getresponse ?? "An error occurred");
      setShowPopup(true);
      setLoader(false);
    } else if (getstatus === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [getstatus, navigate, error, getresponse, details, resetAuthStatus]);
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg p-8 mt-4 bg-white shadow-md border border-gray-300 rounded-lg">
          <div className="flex justify-center mb-8">
            <img src={Classroom} alt="classroom" className="w-4/5" />
          </div>
          <form onSubmit={submitHandler}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="className"
                  className="block text-sm font-medium text-gray-700"
                >
                  Create a class
                </label>
                <input
                  id="className"
                  type="text"
                  value={sclassName}
                  onChange={(event) => setSclassName(event.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loader}
                className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loader ? (
                  <Loader className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  "Create"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full px-4 py-2 mt-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddClass;
