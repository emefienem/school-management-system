import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/api/useAuth";
import { ArrowLeft, Loader } from "lucide-react";

interface TeacherDetails {
  name: string;
  teachSclass?: {
    id: string;
    sclassName: string;
  };
  teachSubject?: {
    subName: string;
    sessions: number;
  };
}

type Params = Record<string, string | undefined>;

const TeacherDetails: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<Params>();
  const { getTeacherDetails, loading, teacherDetails, error } = useAuth();

  const teacherID = params.id;

  useEffect(() => {
    if (teacherID) {
      getTeacherDetails(teacherID);
    }
  }, [teacherID]);

  if (error) {
    console.log(error);
  }

  const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

  const handleAddSubject = () => {
    if (teacherDetails?.teachSclass?.id && teacherDetails?.id) {
      navigate(
        `/admin/teachers/choosesubject/${teacherDetails.teachSclass.id}/${teacherDetails.id}`
      );
    }
  };

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
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-4 uppercase tracking-tight text-blue-500">
            Teacher Details
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-gray-600 font-bold">
                    Attribute
                  </th>
                  <th className="py-2 px-4 border-b text-gray-600 font-bold">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b text-gray-800 font-bold">
                    Teacher Name
                  </td>
                  <td className="py-2 px-4 border-b text-blue-500">
                    {teacherDetails?.name || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b text-gray-800 font-bold">
                    Class Name
                  </td>
                  <td className="py-2 px-4 border-b text-blue-500">
                    {teacherDetails?.teachSclass?.sclassName || "N/A"}
                  </td>
                </tr>
                {isSubjectNamePresent ? (
                  <>
                    <tr>
                      <td className="py-2 px-4 border-b text-gray-800 font-bold">
                        Subject Name
                      </td>
                      <td className="py-2 px-4 border-b text-blue-500">
                        {teacherDetails?.teachSubject?.subName || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b text-gray-800 font-bold">
                        Subject Sessions
                      </td>
                      <td className="py-2 px-4 border-b text-blue-500">
                        {teacherDetails?.teachSubject?.sessions || "N/A"}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      className="py-2 px-4 border-b text-gray-800 font-bold"
                      colSpan={2}
                    >
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleAddSubject}
                      >
                        Add Subject
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDetails;
