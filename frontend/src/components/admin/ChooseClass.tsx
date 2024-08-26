import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableTemplate from "../function/DataTable";
import { useAuth } from "@/api/useAuth";
import SLG from "../../assets/slg.png";

interface ChooseClassProps {
  situation: "Teacher" | "Subject";
}

const ChooseClass: React.FC<ChooseClassProps> = ({ situation }) => {
  const { sclasses, loading, error, getresponse } = useAuth();
  const navigate = useNavigate();

  if (error) {
    console.log(error);
  }

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
        className="bg-purple-600 text-black py-2 px-4 rounded hover:bg-purple-700"
        onClick={() => navigateHandler(row.id)}
      >
        Choose
      </button>
    );
  };

  return (
    <>
      {loading ? (
        <div className="text-center">
          {" "}
          <img src={SLG} alt="Loading" className="animate-spin h-16 w-16" />
        </div>
      ) : (
        <>
          {getresponse ? (
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => navigate("/admin/add-class")}
              >
                Add Class
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">Choose a class</h2>
              {Array.isArray(sclasses) && sclasses.length > 0 && (
                <TableTemplate
                  buttonHaver={SclassButtonHaver}
                  columns={sclassColumns}
                  rows={sclassRows}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ChooseClass;
