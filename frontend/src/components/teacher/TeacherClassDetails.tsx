import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableTemplate from "../function/DataTable";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  EyeIcon,
  Loader,
} from "lucide-react";
import { useAuth } from "@/api/useAuth";

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    getClassStudents,
    sclassStudents,
    loading,
    error,
    getresponse,
  } = useAuth();

  const classID = currentUser?.user?.teachSclassId;
  const subjectID = currentUser?.user?.teachSubjectId;

  useEffect(() => {
    getClassStudents(classID, "class");
  }, [classID]);

  // if (error) {
  //   console.log(error);
  // }

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    name: student.name,
    rollNum: student.rollNum,
    id: student.id,
  }));

  interface StudentButtonHaverProps {
    row: {
      id: string;
    };
  }
  const StudentsButtonHaver: React.FC<StudentButtonHaverProps> = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate(`/teacher/class/student/attendance/${row.id}/${subjectID}`);
    };

    const handleMarks = () => {
      navigate(`/teacher/class/student/marks/${row.id}/${subjectID}`);
    };

    const handleMenuItemClick = (index: number) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
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
          onClick={() => navigate(`/teacher/class/student/${row.id}`)}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        >
          <EyeIcon />
        </button>
        <div className="relative">
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
            <div
              className="absolute z-10 mt-2 bg-white border rounded shadow-lg"
              onClick={handleClose}
            >
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

  return (
    <div className="p-4">
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
        <div>
          <h1 className="text-3xl font-bold text-center mb-4">Class Details</h1>
          {getresponse ? (
            <div className="text-center mt-4">No Students Found</div>
          ) : (
            <div className="overflow-x-auto">
              <h2 className="text-2xl font-semibold mb-2">Students List:</h2>
              {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                <TableTemplate
                  buttonHaver={StudentsButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherClassDetails;
