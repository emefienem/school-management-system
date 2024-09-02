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
          <div className="text-center">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 uppercase">
                Teacher Name:{" "}
                <span className="text-blue-500 font-bold">
                  {teacherDetails?.name}
                </span>
              </h2>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 uppercase">
                Class Name:{" "}
                <span className="text-blue-500 font-bold">
                  {teacherDetails?.teachSclass?.sclassName}
                </span>
              </h2>
            </div>
            {isSubjectNamePresent ? (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 uppercase">
                    Subject Name:{" "}
                    <span className="text-blue-500 font-bold">
                      {teacherDetails?.teachSubject?.subName}
                    </span>
                  </h2>
                </div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 uppercase">
                    Subject Sessions:{" "}
                    <span className="text-blue-500 font-bold">
                      {teacherDetails?.teachSubject?.sessions}
                    </span>
                  </h2>
                </div>
              </>
            ) : (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleAddSubject}
              >
                Add Subject
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDetails;
