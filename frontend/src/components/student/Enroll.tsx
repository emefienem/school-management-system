import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuth } from "@/api/useAuth";
import { toast } from "sonner";

const Enroll: React.FC = () => {
  const {
    currentUser,
    loading,
    enrollSubject,
    getEnrolledSubjects,
    enrolledSubjects,
    getAvailableSubjects,
    availableSubjects,
  } = useAuth();

  const studentId = currentUser?.user?.id;

  const handleEnroll = async (subjectId: string) => {
    try {
      await enrollSubject(studentId, subjectId);
      toast.success(
        `Successfully enrolled in subject: ${availableSubjects.map(
          (subject) => subject.name
        )}`,
        { duration: 4000 }
      );
      console.log(`Successfully enrolled in subject ID: ${subjectId}`);
    } catch (error: any) {
      toast.error(error.message, { duration: 4000 });
    }
  };

  useEffect(() => {
    if (studentId) {
      getAvailableSubjects(studentId);
      getEnrolledSubjects(studentId);
    }
  }, [studentId]);

  const filteredSubjects =
    availableSubjects && enrolledSubjects
      ? availableSubjects.filter(
          (subject) =>
            !enrolledSubjects.some(
              (enrolled) => enrolled.subject.id === subject.id
            )
        )
      : [];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center my-4">
        Available Subjects to Enroll In
      </h2>

      {loading ? (
        <div className="text-center flex justify-center items-center py-4">
          <Loader className="animate-spin w-8 h-8 text-purple-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-gray-600 font-bold">
                  Subject Name
                </th>
                <th className="py-2 px-4 border-b text-gray-600 font-bold">
                  Subject Code
                </th>
                <th className="py-2 px-4 border-b text-gray-600 font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects && filteredSubjects.length > 0 ? (
                filteredSubjects.map(
                  (
                    subject: { subName: string; subCode: string; id: string },
                    index: number
                  ) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-blue-500">
                        {subject.subName}
                      </td>
                      <td className="py-2 px-4 border-b text-blue-500">
                        {subject.subCode}
                      </td>
                      <td className="py-2 px-4 border-b text-blue-500">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:underline"
                          onClick={() => handleEnroll(subject.id)}
                        >
                          Enroll
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-4 border-b text-gray-600">
                    No available subjects to enroll in.
                  </td>
                </tr>
              )}
              {/* {availableSubjects && availableSubjects.length > 0 ? (
                availableSubjects.map(
                  (
                    subject: { subName: string; subCode: string; id: string },
                    index: number
                  ) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-blue-500">
                        {subject.subName}
                      </td>
                      <td className="py-2 px-4 border-b text-blue-500">
                        {subject.subCode}
                      </td>
                      <td className="py-2 px-4 border-b text-blue-500">
                        <button
                          className="text-green-500 hover:underline"
                          onClick={() => handleEnroll(subject.id)}
                        >
                          Enroll
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-4 border-b text-gray-600">
                    No available subjects to enroll in.
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Enroll;
