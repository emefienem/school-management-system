import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableTemplate from "../function/DataTable";
import { useAuth } from "@/api/useAuth";
import { ArrowLeft, Loader } from "lucide-react";

interface ChooseClassProps {
  situation: "Teacher" | "Subject";
}

const ChooseClass: React.FC<ChooseClassProps> = ({ situation }) => {
  const { sclasses, loading, error } = useAuth();
  const navigate = useNavigate();

  const navigateHandler = (classID: string) => {
    if (situation === "Teacher") {
      navigate(`/admin/teachers/choosesubject/${classID}`);
    } else if (situation === "Subject") {
      navigate(`/admin/add-subject/${classID}`);
    }
  };

  const sclassColumns = [{ id: "name", label: "Class Name", minWidth: 170 }];

  const sclassRows =
    sclasses && sclasses.length > 0
      ? sclasses.map((sclass) => ({
          name: sclass.sclassName,
          id: sclass.id,
        }))
      : [];

  const SclassButtonHaver: React.FC<{ row: { id: string } }> = ({ row }) => {
    return (
      <button
        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        onClick={() => navigateHandler(row.id)}
      >
        Choose
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white mb-8"
      />
      {Array.isArray(sclasses) && sclasses.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Choose a class</h2>
          <TableTemplate
            buttonHaver={SclassButtonHaver}
            columns={sclassColumns}
            rows={sclassRows}
          />
        </>
      ) : (
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => navigate("/admin/add-class")}
          >
            Add Class
          </button>
        </div>
      )}
    </>
  );
};

export default ChooseClass;
