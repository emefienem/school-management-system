import React, { useEffect, useState } from "react";
import TableTemplate from "../function/DataTable";
import { ArrowLeft, CheckSquare, Loader, Square } from "lucide-react";
import { useAuth } from "@/api/useAuth";
import { useNavigate } from "react-router";

const SeeComplains: React.FC = () => {
  const navigate = useNavigate();

  const {
    currentUser,
    getAllComplains,
    complainList,
    loading,
    error,
    getresponse,
  } = useAuth();

  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCheckbox = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const ID = currentUser.user.id;
  useEffect(() => {
    if (currentUser.user.id) {
      getAllComplains(ID, "complain");
      console.log(getresponse);
    }
  }, [ID]);

  const complainColumns = [
    { id: "user", label: "User", minWidth: 170 },
    { id: "complaint", label: "Complaint", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const complainRows = Array.isArray(complainList)
    ? complainList.map((complain) => {
        const date = new Date(complain.date);
        const dateString =
          date.toString() !== "Invalid Date"
            ? date.toISOString().substring(0, 10)
            : "Invalid Date";
        return {
          user: complain?.teacher?.name
            ? complain?.teacher?.name
            : complain?.student?.name,
          complaint: complain.complaint,
          date: dateString,
          id: complain.id,
        };
      })
    : [];

  const ComplainButtonHaver: React.FC<{ row: any }> = ({ row }) => (
    <div className="flex justify-center items-center">
      <Checkbox
        checked={checkedItems[row.id] || false}
        onChange={() => toggleCheckbox(row.id)}
        aria-label="Checkbox"
      />
    </div>
  );

  return (
    <div className="">
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
            <div className=" mt-4 text-black text-center">
              No Complains Right Now
            </div>
          ) : (
            <div className="w-full overflow-hidden bg-white shadow rounded-lg">
              {Array.isArray(complainList) && complainList.length > 0 && (
                <TableTemplate
                  buttonHaver={ComplainButtonHaver}
                  columns={complainColumns}
                  rows={complainRows}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeeComplains;

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <div onClick={onChange} className="cursor-pointer">
      {checked ? (
        <CheckSquare className="h-5 w-5 text-gray-600" />
      ) : (
        <Square className="h-5 w-5 text-gray-600" />
      )}
    </div>
  );
};
