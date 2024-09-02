import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuth } from "@/api/useAuth";

interface ChooseSubjectProps {
  situation: "Norm" | "Teacher";
}

const ChooseSubject: React.FC<ChooseSubjectProps> = ({ situation }) => {
  const params = useParams<{ id: string; teacherID?: string }>();
  const navigate = useNavigate();

  const [classID, setClassID] = useState<string>("");
  const [teacherID, setTeacherID] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  const {
    getTeacherFreeClassSubjects,
    updateTeachSubject,
    subjectsList,
    loading,
    error,
    getresponse,
  } = useAuth();

  useEffect(() => {
    if (situation === "Norm") {
      setClassID(params.id!);
      getTeacherFreeClassSubjects(params.id!);
    } else if (situation === "Teacher") {
      setClassID(params.teacherID!);
      setTeacherID(params.id!);
      getTeacherFreeClassSubjects(params.id!);
    }
  }, [situation, params]);

  const updateSubjectHandler = (teacherId: string, subjectId: string) => {
    setLoader(true);
    updateTeachSubject(teacherId, subjectId);
    navigate("/admin/teachers");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-purple-600" />
      </div>
    );
  } else if (getresponse === "Assigned") {
    console.log(getresponse);
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold text-center text-red-500">
          Sorry, all subjects have teachers assigned already
        </h1>
        <div className="flex justify-end mt-4">
          <button
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            onClick={() => navigate(`/admin/add-subject/${classID}`)}
          >
            Add Subjects
          </button>
        </div>
      </div>
    );
  }
  // else if (error) {
  //   console.error(error);
  //   return <div className="text-center text-red-500">An error occurred.</div>;
  // }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Choose a Subject</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Subject Name</th>
              <th className="px-4 py-2">Subject Code</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
              subjectsList.map((subject, index) => (
                <tr key={subject._id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{subject.subName}</td>
                  <td className="px-4 py-2">{subject.subCode}</td>
                  <td className="px-4 py-2 text-center">
                    {situation === "Norm" ? (
                      <button
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                        onClick={() =>
                          navigate(`/admin/teachers/addteacher/${subject.id}`)
                        }
                      >
                        Choose
                      </button>
                    ) : (
                      <button
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
                        disabled={loader}
                        onClick={() =>
                          updateSubjectHandler(teacherID, subject.id)
                        }
                      >
                        {loader ? (
                          <Loader className="animate-spin w-5 h-5 mx-auto" />
                        ) : (
                          "Choose Sub"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No subjects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChooseSubject;
