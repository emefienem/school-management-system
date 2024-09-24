import React, { useEffect, useState, useRef, MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const ShowParents: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    getAllParents,
    parentsList,
    loading,
    error,
    getresponse,
    deleteUser,
  } = useAuth();

  const ID = currentUser?.user?.id;
  useEffect(() => {
    if (currentUser && ID) {
      getAllParents(ID);
      // getUserDetails(, "student");
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
      getAllParents(currentUser?.user?.id);
    });
  };

  const parentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "children", label: "Children", minWidth: 100 },
    // { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const parentRows =
    parentsList && parentsList.length > 0
      ? parentsList.map((parent) => ({
          name: parent.name,
          children: parent.children
            .map((child: { name: string }) => child.name)
            .join(", "),
          // sclassName: student.sclass.sclassName,
          id: parent.id,
        }))
      : [];

  interface ParentButtonHaverProps {
    row: {
      id: string;
    };
  }

  const ParentButtonHaver: React.FC<ParentButtonHaverProps> = ({ row }) => {
    return (
      <div className="flex items-center space-x-2 justify-center">
        <button
          onClick={() => deleteHandler(row.id, "parent")}
          className="text-red-600 hover:text-red-800"
        >
          <XCircle className="h-5 w-5" />
        </button>
        <button
          // onClick={() => navigate("/admin/students/student/" + row.id)}
          className="bg-orange-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        >
          Check Fee Status
        </button>
      </div>
    );
  };

  const actions = [
    {
      icon: <PlusCircle className="text-blue-600" />,
      name: "Add New Parent",
      action: () => navigate("/admin/add-parents"),
    },
    {
      icon: <XCircle className="text-red-600" />,
      name: "Delete All Parents",
      action: () => deleteHandler(ID, "parent"),
    },
  ];

  return (
    <>
      {loading ? (
        <>
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white mb-8 cursor-pointer"
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
                onClick={() => navigate("/admin/add-parents")}
              >
                Add Parents
              </button>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              {Array.isArray(parentsList) && parentsList.length > 0 && (
                <TableTemplate
                  buttonHaver={ParentButtonHaver}
                  columns={parentColumns}
                  rows={parentRows}
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

export default ShowParents;
