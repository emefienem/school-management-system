import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/useAuth";
import {
  PlusIcon,
  Trash2Icon,
  EyeIcon,
  MenuIcon,
  ArrowLeft,
  XCircle,
  PlusCircle,
  Loader,
} from "lucide-react";
import QuickActionDial from "../function/QuickActionDial";
import TableTemplate from "../function/DataTable";
import Popup from "../function/Popup";
import SLG from "../../assets/slg.png";

const ShowClasses = () => {
  const navigate = useNavigate();
  const {
    sclasses,
    currentUser,
    getAllSclasses,
    loading,
    getresponse,
    deleteUser,
  } = useAuth();

  const ID = currentUser.user.id;

  useEffect(() => {
    console.log("adminID:", ID);
    if (ID) {
      getAllSclasses(ID, "class");
      console.log("Fetched Classes:", sclasses);
      console.log("Generated Rows:", sclassRows);
      console.log("Response Check:", getresponse);
      console.log(sclasses);
    } else console.log("Admin ID is undefined");
  }, [ID, getAllSclasses]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = async (deleteID: any, address: string) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry the delete function has been disabled for now.");
    // setShowPopup(true);
    await deleteUser(deleteID, address).then(() => {
      getAllSclasses(ID, "class");
    });
  };

  const sclassColumns = [{ id: "name", label: "Class Name", minWidth: 170 }];

  const sclassRows = sclasses?.length
    ? sclasses.map((sclass) => ({
        name: sclass.sclassName,
        id: sclass.id,
      }))
    : [];

  type SclassRow = {
    id: string;
  };
  const SclassButtonHaver = ({ row }: { row: SclassRow }) => {
    const actions = [
      {
        icon: <PlusIcon />,
        name: "Add Subjects",
        action: () => navigate("/admin/add-subject/" + row.id),
      },
      {
        icon: <PlusIcon />,
        name: "Add Student",
        action: () => navigate("/admin/class/add-students/" + row.id),
      },
    ];

    return (
      <div className="flex gap-2 items-center justify-center">
        <button
          onClick={() => deleteHandler(row.id, "class")}
          className="p-2 text-red-500 hover:text-red-700"
        >
          <Trash2Icon />
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/admin/classes/class/" + row.id)}
        >
          <EyeIcon />
        </button>
        <ActionMenu actions={actions} />
      </div>
    );
  };

  type Action = {
    icon: React.ReactNode;
    name: string;
    action: () => void;
  };

  type ActionMenuProps = {
    actions: Action[];
  };

  const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClick = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className="p-2 text-blue-500 hover:text-blue-700"
        >
          <MenuIcon />
          {/* Add */}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center p-2 hover:bg-gray-100 w-full text-left"
              >
                <span className="mr-2">{action.icon}</span>
                {action.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const actions = [
    {
      icon: <PlusCircle className="text-blue-600" />,
      name: "Add New Class",
      action: () => navigate("/admin/add-class"),
    },
    {
      icon: <XCircle className="text-red-600" />,
      name: "Delete All Classes",
      action: () => deleteHandler(ID, "class"),
    },
  ];
  return (
    <div className="relative">
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
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                onClick={() => navigate("/admin/add-class")}
              >
                Add Class
              </button>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              {Array.isArray(sclasses) && sclasses.length > 0 && (
                <TableTemplate
                  buttonHaver={SclassButtonHaver}
                  columns={sclassColumns}
                  rows={sclassRows}
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
    </div>
  );
};

export default ShowClasses;
