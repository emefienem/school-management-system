import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, UserMinus, UserPlus } from "lucide-react";
import TableTemplate from "../function/DataTable";
import Popup from "../function/Popup";
import { useAuth } from "@/api/useAuth";
import SLG from "../../assets/slg.png";
import QuickActionDial from "../function/QuickActionDial";

interface Teacher {
  id: string;
  name: string;
  teachSubject?: { subName: string };
  teachSclass: { sclassName: string; id: string };
}

interface Column {
  id: string;
  label: string;
  minWidth: number;
}

const ShowTeachers: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const {
    currentUser,
    getAllTeachers,
    teachersList,
    loading,
    error,
    getresponse,
    deleteUser,
  } = useAuth();
  const ID = currentUser?.user?.id;

  useEffect(() => {
    if (ID) {
      getAllTeachers(ID);
    }
  }, [ID]);

  if (loading) {
    return (
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
    );
  } else if (getresponse) {
    console.log(getresponse);
    return (
      <>
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white mb-8"
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={() => navigate("/admin/teachers/chooseclass")}
          >
            Add Teacher
          </button>
        </div>
      </>
    );
  }

  const deleteHandler = (deleteID: string, address: string) => {
    console.log(deleteID);
    console.log(address);
    // setMessage("Sorry, the delete function has been disabled for now.");
    // setShowPopup(true);

    deleteUser(deleteID, address).then(() => {
      getAllTeachers(ID);
    });
  };

  const columns: Column[] = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "teachSubject", label: "Subject", minWidth: 100 },
    { id: "teachSclass", label: "Class", minWidth: 170 },
  ];

  const rows = teachersList.map((teacher: Teacher) => ({
    name: teacher.name,
    teachSubject: teacher.teachSubject?.subName || null,
    teachSclass: teacher.teachSclass?.sclassName || "",
    teachSclassID: teacher.teachSclass?.id,
    id: teacher.id,
  }));

  const actions = [
    {
      icon: <UserPlus className="text-blue-500" />,
      name: "Add New Teacher",
      action: () => navigate("/admin/teachers/chooseclass"),
    },
    {
      icon: <UserMinus className="text-red-500" />,
      name: "Delete All Teachers",
      action: () => deleteHandler(ID, "teacher"),
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white mb-8"
      />
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof typeof row];
                    if (column.id === "teachSubject") {
                      return (
                        <td
                          key={column.id}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {value ? (
                            value
                          ) : (
                            <button
                              className="bg-blue-500 text-white py-1 px-2 rounded"
                              onClick={() => {
                                navigate(
                                  `/admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`
                                );
                              }}
                            >
                              Add Subject
                            </button>
                          )}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={column.id}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {value}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button onClick={() => deleteHandler(row.id, "teacher")}>
                      <UserMinus className="text-red-500" />
                    </button>
                    <button
                      className="bg-blue-500 text-white py-1 px-3 ml-2 rounded"
                      onClick={() =>
                        navigate("/admin/teachers/teacher/" + row.id)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center py-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            Showing {page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}{" "}
            results
          </p>
        </div>
        <div className="flex items-center">
          <button
            className={`text-sm ${
              page === 0 ? "text-gray-400" : "text-blue-500"
            }`}
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <select
            className="mx-2 text-sm border border-gray-300 rounded"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          >
            {[5, 10, 25, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button
            className={`text-sm ${
              page === Math.ceil(rows.length / rowsPerPage) - 1
                ? "text-gray-400"
                : "text-blue-500"
            }`}
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil(rows.length / rowsPerPage) - 1}
          >
            Next
          </button>
        </div>
      </div>
      <QuickActionDial actions={actions} />
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default ShowTeachers;
