import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Popup from "../function/Popup";
import { useAuth } from "@/api/useAuth";

const TeacherComplain = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { getstatus, currentUser, error, addStuff } = useAuth();

  const teacherId = currentUser?.user?.id;
  const schoolId = currentUser?.user?.school?.id;
  const address = "complain";

  const fields = {
    teacherId,
    date,
    complaint,
    schoolId,
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoader(true);
    addStuff(fields, address);
  };

  useEffect(() => {
    if (getstatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Done Successfully");
    }
    // else if (error) {
    //   setLoader(false);
    //   setShowPopup(true);
    //   setMessage("Network Error");
    // }
  }, [getstatus]);

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center">Complain</h2>
          </div>
          <form onSubmit={submitHandler}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Write your complaint
                </label>
                <textarea
                  value={complaint}
                  onChange={(event) => setComplaint(event.target.value)}
                  required
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Describe your issue..."
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loader}
              className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loader ? (
                <Loader className="animate-spin mx-auto h-5 w-5" />
              ) : (
                "Add"
              )}
            </button>
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

export default TeacherComplain;
