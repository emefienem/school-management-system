import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, Plus, Trash } from "lucide-react";
import TableTemplate from "../function/DataTable";
import Popup from "../function/Popup";
import { useAuth } from "../../api/useAuth";
import SLG from "../../assets/slg.png";

interface Subject {
  subName: string;
  sessions: string;
  sclass: {
    sclassName: string;
    schoolId: string;
  };
  id: string;
  // sclassName: string;
}

const ShowSubjects: React.FC = () => {
  const {
    currentUser,
    deleteUser,
    getSubjectList,
    loading,
    error,
    getresponse,
    subjectsList,
    getAllSclasses,
  } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const ID = currentUser?.user?.id;

  useEffect(() => {
    if (ID) {
      getSubjectList(ID, "subject");
      getAllSclasses(ID, "class");
      console.log(subjectsList);
    } else console.log("ID undefined");
  }, [ID, getSubjectList, getAllSclasses]);

  const deleteHandler = async (deleteID: string, address: string) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry, the delete function has been disabled for now.");
    // setShowPopup(true);
    await deleteUser(deleteID, address).then(() => {
      getSubjectList(ID, "subject");
    });
  };

  const subjectColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const subjectRows = Array.isArray(subjectsList)
    ? subjectsList.map((subject: Subject) => ({
        subName: subject.subName,
        sessions: subject.sessions,
        sclassName: subject.sclass.sclassName,
        sclassId: subject.id,
        id: subject.id,
      }))
    : [];

  const SubjectsButtonHaver: React.FC<{ row: any }> = ({ row }) => {
    return (
      <>
        <button
          onClick={() => deleteHandler(row.id, "subject")}
          className="text-red-500 hover:text-red-700"
        >
          <Trash size={20} />
        </button>
        <button
          onClick={() =>
            navigate(`/admin/subjects/subject/${row.sclassId}/${row.id}`)
          }
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2"
        >
          View
        </button>
      </>
    );
  };

  const actions = [
    {
      icon: <Plus className="text-blue-500" size={24} />,
      name: "Add New Subject",
      action: () => navigate("/admin/subjects/chooseclass"),
    },
    {
      icon: <Trash className="text-red-500" size={24} />,
      name: "Delete All Subjects",
      action: () => deleteHandler(ID, "Subjects"),
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
                onClick={() => navigate("/admin/subjects/chooseclass")}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Subjects
              </button>
            </div>
          ) : (
            <div className="w-full overflow-hidden mt-4">
              {subjectRows.length > 0 ? (
                <TableTemplate
                  buttonHaver={SubjectsButtonHaver}
                  columns={subjectColumns}
                  rows={subjectRows}
                />
              ) : (
                <div className="text-center text-gray-500">
                  No subjects found.
                </div>
              )}
              <div className="fixed bottom-8 right-8">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-2 mb-2 p-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200"
                  >
                    {action.icon}
                    <span>{action.name}</span>
                  </button>
                ))}
              </div>
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

export default ShowSubjects;
