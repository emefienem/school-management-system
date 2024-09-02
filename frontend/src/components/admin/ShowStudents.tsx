import React, { useEffect, useState, useRef, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
// import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  XCircle,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  EyeIcon,
  ArrowLeft,
  Loader,
} from "lucide-react";
import Popup from "../function/Popup";
import TableTemplate from "../function/DataTable";
import QuickActionDial from "../function/QuickActionDial";
import { useAuth } from "@/api/useAuth";
import SLG from "../../assets/slg.png";

const ShowStudents: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    getAllStudents,
    studentsList,
    loading,
    error,
    getresponse,
    deleteUser,
  } = useAuth();

  const ID = currentUser.user.id;
  useEffect(() => {
    if (currentUser && ID) {
      getAllStudents(ID);
    }
  }, [ID]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID: string, address: string) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry, the delete function has been disabled for now.");
    // setShowPopup(true);

    deleteUser(deleteID, address).then(() => {
      getAllStudents(currentUser.user.id);
    });
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const studentRows =
    studentsList && studentsList.length > 0
      ? studentsList.map((student) => ({
          name: student.name,
          rollNum: student.rollNum,
          sclassName: student.sclass.sclassName,
          id: student.id,
        }))
      : [];

  interface StudentButtonHaverProps {
    row: {
      id: string;
    };
  }

  const StudentButtonHaver: React.FC<StudentButtonHaverProps> = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate("/admin/students/student/attendance/" + row.id);
    };

    const handleMarks = () => {
      navigate("/admin/students/student/marks/" + row.id);
    };

    const handleMenuItemClick = (index: number) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent<Document>) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };

    return (
      <div className="flex items-center space-x-2 justify-center">
        <button
          onClick={() => deleteHandler(row.id, "student")}
          className="text-red-600 hover:text-red-800"
        >
          <XCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => navigate("/admin/students/student/" + row.id)}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        >
          <EyeIcon />
        </button>
        <div className="relative" ref={anchorRef}>
          <div className="flex">
            <button
              onClick={handleClick}
              className="bg-black text-white py-1 px-3 rounded-l hover:bg-gray-800"
            >
              {options[selectedIndex]}
            </button>
            <button
              onClick={handleToggle}
              className="bg-gray-600 text-white py-1 px-2 rounded-r hover:bg-gray-700"
            >
              {open ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          {open && (
            <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
              {options.map((option, index) => (
                <button
                  key={option}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    index === selectedIndex ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleMenuItemClick(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const actions = [
    {
      icon: <PlusCircle className="text-blue-600" />,
      name: "Add New Student",
      action: () => navigate("/admin/add-students"),
    },
    {
      icon: <XCircle className="text-red-600" />,
      name: "Delete All Students",
      action: () => deleteHandler(ID, "Students"),
    },
  ];

  return (
    <>
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
        <>
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white mb-8"
          />

          {getresponse ? (
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={() => navigate("/admin/add-students")}
              >
                Add Students
              </button>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              {Array.isArray(studentsList) && studentsList.length > 0 && (
                <TableTemplate
                  buttonHaver={StudentButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              )}
              <QuickActionDial actions={actions} />
            </div>
          )}
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ShowStudents;
