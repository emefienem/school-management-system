import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import TableView from "../function/TableView";
import { useAuth } from "@/api/useAuth";

const SeeNotice: React.FC = () => {
  const {
    currentUser,
    currentRole,
    getAllNotices,
    noticeList,
    loading,
    error,
    getresponse,
  } = useAuth();

  // const ID = currentUser?.user?.id;
  useEffect(() => {
    const ID =
      currentRole === "Admin"
        ? currentUser?.user?.id
        : currentRole === "teacher"
        ? currentUser?.user?.school?.id
        : currentUser?.user?.schoolId;
    if (ID) getAllNotices(ID);
  }, [currentRole, currentUser]);

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows = noticeList.map((notice: any) => {
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
  });

  return (
    <div className="mt-12 mr-5">
      {loading ? (
        <div className="text-xl flex justify-center items-center">
          <Loader className="animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <>
          <h3 className="text-3xl mb-10">Notices</h3>
          <div className="w-full overflow-hidden shadow-md sm:rounded-lg">
            {Array.isArray(noticeList) && noticeList.length > 0 && (
              <TableView columns={noticeColumns} rows={noticeRows} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SeeNotice;
