import React, { useEffect } from "react";
import { useAuth } from "@/api/useAuth";
import { ArrowLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router";

interface Attendance {
  id: string;
  date: string;
  status: string;
  subName: {
    subName: string;
  };
}

interface ExamResult {
  id: string;
  marksObtained: number;
  subName: {
    subName: string;
  };
}

interface Student {
  id: string;
  name: string;
  attendance: Attendance[];
  examResults: ExamResult[];
}

interface ParentDetails {
  id: string;
  name: string;
  email: string;
  children: Student[];
}

const ViewChildren: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, loading, error, getUserDetails, userDetails } =
    useAuth();
  const parentId = currentUser?.user?.id;

  useEffect(() => {
    if (parentId) {
      getUserDetails(parentId, "parent");
    }
  }, [parentId, getUserDetails]);

  if (loading)
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
  //   if (error) return <div>{error}</div>;

  const parent = userDetails as ParentDetails | null;

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "50%",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <tbody>
            <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                Name of Parent
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                {parent?.name}
              </td>
            </tr>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                Your Email
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                {parent?.email}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {parent?.children?.map((student) => (
        <div key={student.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                width: "50%",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <tbody>
                <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    Child's Name
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    {student.name}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5
            style={{
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            Attendance
          </h5>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
                <th
                  style={{ border: "none", padding: "12px", textAlign: "left" }}
                >
                  Date
                </th>
                <th
                  style={{ border: "none", padding: "12px", textAlign: "left" }}
                >
                  Status
                </th>
                <th
                  style={{ border: "none", padding: "12px", textAlign: "left" }}
                >
                  Subject
                </th>
              </tr>
            </thead>
            <tbody>
              {student.attendance.map((att, index) => (
                <tr
                  key={att.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#bbdefb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#f9f9f9" : "white")
                  }
                >
                  <td style={{ padding: "12px", border: "none" }}>
                    {new Date(att.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px", border: "none" }}>
                    {att.status}
                  </td>
                  <td style={{ padding: "12px", border: "none" }}>
                    {att.subName.subName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Child Exam Results
          </h5>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                <th
                  style={{ border: "none", padding: "12px", textAlign: "left" }}
                >
                  Child's Subject
                </th>
                <th
                  style={{ border: "none", padding: "12px", textAlign: "left" }}
                >
                  Marks Obtained
                </th>
              </tr>
            </thead>
            <tbody>
              {student.examResults.map((exam, index) => (
                <tr
                  key={exam.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e1f5fe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "#f9f9f9" : "white")
                  }
                >
                  <td style={{ padding: "12px", border: "none" }}>
                    {exam.subName.subName}
                  </td>
                  <td style={{ padding: "12px", border: "none" }}>
                    {exam.marksObtained}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Child Assignment Marks
        </h3>
        {userDetails && userDetails?.answer?.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-left text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 border-b text-left text-gray-700">
                  Marks
                </th>
                <th className="px-4 py-2 border-b text-left text-gray-700">
                  Submission Date and Time
                </th>
              </tr>
            </thead>
            <tbody>
              {userDetails?.answer?.map(
                (
                  result: {
                    assignment: { title: string };
                    score: number;
                    submittedAt: string;
                  },
                  index: number
                ) => {
                  return (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border-b text-gray-800">
                        {result?.assignment?.title}
                      </td>
                      <td className="px-4 py-2 border-b text-gray-600">
                        {result?.score}
                      </td>
                      <td className="px-4 py-2 border-b text-gray-600">
                        {result?.submittedAt}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No assignment data available</p>
        )}
      </div>
    </div>
  );
};

export default ViewChildren;
