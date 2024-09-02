import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Trash2, PlusCircle, UserPlus, UserX, Loader } from "lucide-react";
import Popup from "../function/Popup";
import { useAuth } from "@/api/useAuth";
import QuickActionDial from "../function/QuickActionDial";
import TableTemplate from "../function/DataTable";

interface Subject {
  subName: string;
  subCode: string;
  id: string;
}

interface Student {
  name: string;
  rollNum: string;
  id: string;
}

interface ButtonHaverProps {
  row: {
    id: string;
  };
}

type Params = Record<string, string | undefined>;

const ClassDetails = () => {
  const params = useParams<Params>();
  const navigate = useNavigate();
  const {
    subjectsList,
    sclassStudents,
    sclassDetails,
    loading,
    error,
    getresponse,
    getClassDetails,
    getClassStudents,
    getSubjectList,
  } = useAuth();

  const classID = params.id;
  useEffect(() => {
    if (classID) {
      getClassDetails(classID, "class");
      getSubjectList(classID, "subject");
      getClassStudents(classID, "class");
    }
  }, [classID, getClassStudents, getSubjectList, getClassDetails]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const deleteHandler = (deleteID: string, address: string) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry, the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const subjectColumns = [
    { id: "name", label: "Subject Name", minWidth: 170 },
    { id: "code", label: "Subject Code", minWidth: 100 },
  ];

  const subjectRows =
    Array.isArray(subjectsList) && subjectsList.length > 0
      ? subjectsList.map((subject: Subject) => ({
          name: subject.subName,
          code: subject.subCode,
          id: subject.id,
        }))
      : [];

  const SubjectsButtonHaver = ({ row }: ButtonHaverProps) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => deleteHandler(row.id, "subject")}
          className="text-red-500"
        >
          <Trash2 />
        </button>
        <button
          onClick={() => {
            navigate(`/admin/class/subject/${classID}/${row.id}`);
          }}
          className="text-blue-500"
        >
          View
        </button>
      </div>
    );
  };

  const subjectActions = [
    {
      icon: <PlusCircle className="text-blue-500" />,
      name: "Add New Subject",
      action: () => navigate("/admin/add-subject/" + classID),
    },
    {
      icon: <Trash2 className="text-red-500" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(classID!, "subject"),
    },
  ];

  const ClassSubjectsSection = () => {
    return (
      <>
        {getresponse ? (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate("/admin/add-subject/" + classID)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Add Subjects
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Subjects List:</h2>
            <TableTemplate
              buttonHaver={SubjectsButtonHaver}
              columns={subjectColumns}
              rows={subjectRows}
            />
            <QuickActionDial actions={subjectActions} />
          </>
        )}
      </>
    );
  };

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student: Student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student.id,
    };
  });

  const StudentsButtonHaver = ({ row }: ButtonHaverProps) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => deleteHandler(row.id, "Student")}
          className="text-red-500"
        >
          <UserX />
        </button>
        <button
          onClick={() => navigate("/admin/students/student/" + row.id)}
          className="text-blue-500"
        >
          View
        </button>
        <button
          onClick={() =>
            navigate("/admin/students/student/attendance/" + row.id)
          }
          className="text-purple-500"
        >
          Attendance
        </button>
      </div>
    );
  };

  const studentActions = [
    {
      icon: <UserPlus className="text-blue-500" />,
      name: "Add New Student",
      action: () => navigate("/admin/class/add-students/" + classID),
    },
    {
      icon: <UserX className="text-red-500" />,
      name: "Delete All Students",
      action: () => deleteHandler(classID!, "student"),
    },
  ];

  const ClassStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate("/admin/class/add-students/" + classID)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Add Students
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Students List:</h2>
            <TableTemplate
              buttonHaver={StudentsButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
            <QuickActionDial actions={studentActions} />
          </>
        )}
      </>
    );
  };

  const ClassTeachersSection = () => {
    return (
      <>
        <h2 className="text-xl font-semibold mb-4">Teachers</h2>
        {/* I would add teachers section here */}
      </>
    );
  };

  const ClassDetailsSection = () => {
    const numberOfSubjects = Array.isArray(subjectsList)
      ? subjectsList.length
      : 0;
    const numberOfStudents = Array.isArray(sclassStudents)
      ? sclassStudents.length
      : 0;
    return (
      <>
        <h1 className="text-3xl font-semibold mb-4 uppercase tracking-tight text-blue-500">
          Class Details
        </h1>
        <div className="text-center space-y-12">
          <h2 className="text-xl font-semibold mb-2 uppercase">
            class{" "}
            <span className="text-blue-500 font-bold">
              {sclassDetails && sclassDetails.sclassName}
            </span>
          </h2>
          <p className="text-lg mb-2 uppercase font-bold">
            Number of Subjects:{" "}
            <span className="text-blue-500">{numberOfSubjects}</span>
          </p>
          <p className="text-lg mb-2 uppercase font-bold">
            Number of Students:{" "}
            <span className="text-blue-500">{numberOfStudents}</span>
          </p>

          <div className="flex space-x-4 justify-center items-center mt-5">
            {getresponse && (
              <button
                onClick={() => navigate("/admin/class/add-students/" + classID)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Add Students
              </button>
            )}
            {getresponse && (
              <button
                onClick={() => navigate("/admin/add-subject/" + classID)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Add Subjects
              </button>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin w-12 h-12 text-purple-600" />
        </div>
      ) : (
        <div className="w-full">
          <Tabs selectedIndex={value} onSelect={(index) => setValue(index)}>
            <TabList className="fixed top-0 w-full bg-white shadow-md z-10">
              <Tab>Details</Tab>
              <Tab>Subjects</Tab>
              <Tab>Students</Tab>
              <Tab>Teachers</Tab>
            </TabList>
            <div className="mt-20 p-6">
              <TabPanel>
                <ClassDetailsSection />
              </TabPanel>
              <TabPanel>
                <ClassSubjectsSection />
              </TabPanel>
              <TabPanel>
                <ClassStudentsSection />
              </TabPanel>
              <TabPanel>
                <ClassTeachersSection />
              </TabPanel>
            </div>
          </Tabs>
        </div>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ClassDetails;
