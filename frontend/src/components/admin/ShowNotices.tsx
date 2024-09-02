import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, Trash2Icon } from "lucide-react";
import TableTemplate from "../function/DataTable";
import QuickActionDial from "../function/QuickActionDial";
import { useAuth } from "@/api/useAuth";

const ShowNotices: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    getAllNotices,
    noticeList,
    loading,
    error,
    getresponse,
    deleteUser,
  } = useAuth();

  const ID = currentUser?.user?.id;

  useEffect(() => {
    if (ID) getAllNotices(ID);
  }, [ID]);

  const deleteHandler = (deleteID: string, address: string) => {
    deleteUser(deleteID, address).then(() => {
      getAllNotices(ID);
    });
  };

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows = Array.isArray(noticeList)
    ? noticeList.map((notice: any) => {
        const date = new Date(notice.date);
        const dateString =
          date.toString() !== "Invalid Date"
            ? date.toISOString().substring(0, 10)
            : "Invalid Date";
        return {
          title: notice.title,
          details: notice.details,
          date: dateString,
          id: notice.id,
        };
      })
    : [];

  const NoticeButtonHaver: React.FC<{ row: any }> = ({ row }) => {
    return (
      <button
        onClick={() => deleteHandler(row.id, "Notice")}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2Icon className="w-5 h-5" />
      </button>
    );
  };

  const actions = [
    {
      icon: <FilePlus className="w-6 h-6 text-blue-500" />,
      name: "Add New Notice",
      action: () => navigate("/admin/add-notice"),
    },
    {
      icon: <Trash2Icon className="w-6 h-6 text-red-600" />,
      name: "Delete All Notices",
      action: () => deleteHandler(ID, "notice"),
    },
  ];

  return (
    <div className="p-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {getresponse ? (
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => navigate("/admin/add-notice")}
              >
                Add Notice
              </button>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              {Array.isArray(noticeList) && noticeList.length > 0 && (
                <TableTemplate
                  buttonHaver={NoticeButtonHaver}
                  columns={noticeColumns}
                  rows={noticeRows}
                />
              )}
              <QuickActionDial actions={actions} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShowNotices;
