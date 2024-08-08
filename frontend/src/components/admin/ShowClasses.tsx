import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/useAuth";
import { PlusIcon, Trash2Icon, EyeIcon, MenuIcon } from "lucide-react";
import QuickActionDial from "../QuickActionDial";
import TableTemplate from "../DataTable";
import Popup from "../Popup";

const ShowClasses = () => {
  const navigate = useNavigate();
  const { sclassesList, currentUser, getAllSclasses, loading, getresponse } =
    useAuth();

  const adminID = currentUser.user.id;

  useEffect(() => {
    if (adminID) {
      getAllSclasses(adminID, "class");
    } else console.log("Admin ID is undefined");
  }, [adminID]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = async (deleteID: any, address: string) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
    // await deleteUser(deleteID, address).then(() => {
    //   getAllSclasses(adminID, "class");
    // });
  };

  const sclassColumns = [{ id: "name", label: "Class Name", minWidth: 170 }];

  const sclassRows = sclassesList?.length
    ? sclassesList.map((sclass) => ({
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => deleteHandler(row.id, "Sclass")}
          className="p-2 text-red-500 hover:text-red-700"
        >
          <Trash2Icon />
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/admin/classes/class/" + row.id)}
        >
          <EyeIcon />
          View
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
          Add
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
      icon: <PlusIcon />,
      name: "Add New Class",
      action: () => navigate("/admin/add-class"),
    },
    {
      icon: <Trash2Icon />,
      name: "Delete All Classes",
      action: () => deleteHandler(adminID, "Sclasses"),
    },
  ];
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
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
            <>
              {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                <TableTemplate
                  buttonHaver={SclassButtonHaver}
                  columns={sclassColumns}
                  rows={sclassRows}
                />
              )}
              <QuickActionDial actions={actions} />
            </>
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

export default ShowClasses;
