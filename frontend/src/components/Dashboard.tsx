import React, { useEffect } from "react";
import { useAuth } from "@/api/useAuth";
import {
  GraduationCapIcon,
  User2Icon,
  Table,
  DollarSign,
  Users,
  Book,
  FileText,
  Clock,
} from "lucide-react";
import SeeNotice from "../components/admin/SeeNotice";
import CountUp from "react-countup";
import AuthorizedComponent from "./AuthorizedComponent";

const Dashboard = () => {
  const {
    currentUser,
    subjectDetails,
    sclassStudents,
    getSubjectDetails,
    getClassStudents,
    getAllStudents,
    getAllSclasses,
    getAllTeachers,
    studentsList,
    sclassesList,
  } = useAuth();

  const adminID = currentUser.user.id;
  const classID = currentUser?.teachSclass?.id;
  const subjectID = currentUser?.teachSubject?.id;

  useEffect(() => {
    if (subjectID) getSubjectDetails(subjectID);
    if (classID) getClassStudents(classID);
  }, [subjectID, classID]);

  useEffect(() => {
    if (adminID) {
      getAllStudents(adminID);
      getAllSclasses(adminID, "class");
      getAllTeachers(adminID);
    }
  }, [adminID, getAllStudents, getAllSclasses, getAllTeachers]);

  const numberOfStudent = studentsList && studentsList.length;
  const numberOfClasses = sclassesList && sclassesList.length;
  const numberOfTeachers = 3;

  const numberOfStudents = sclassStudents?.length || 0;
  const numberOfSessions = subjectDetails?.sessions || 0;

  return (
    <div className="container mx-auto mt-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AuthorizedComponent roles={["Admin"]}>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <GraduationCapIcon className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p className="text-lg font-semibold">Total Students</p>
            <CountUp
              start={0}
              end={numberOfStudent}
              duration={2.5}
              className="text-xl font-bold text-green-600"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <Table className="w-12 h-12 mx-auto mb-2 text-blue-500" />
            <p className="text-lg font-semibold">Total Classes</p>
            <CountUp
              start={0}
              end={numberOfClasses}
              duration={2.5}
              className="text-xl font-bold text-blue-600"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <User2Icon className="w-12 h-12 mx-auto mb-2 text-purple-500" />
            <p className="text-lg font-semibold">Total Teachers</p>
            <CountUp
              start={0}
              end={numberOfTeachers}
              duration={2.5}
              className="text-xl font-bold text-purple-600"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
            <p className="text-lg font-semibold">Fees Collection</p>
            <CountUp
              start={0}
              end={23000}
              duration={2.5}
              prefix="$"
              className="text-xl font-bold text-yellow-600"
            />
          </div>
        </AuthorizedComponent>

        <AuthorizedComponent roles={["Teacher"]}>
          <Card
            icon={<Users size={32} />}
            title="Class Students"
            count={numberOfStudents}
            duration={2.5}
          />
          <Card
            icon={<Book size={32} />}
            title="Total Lessons"
            count={numberOfSessions}
            duration={5}
          />
          <Card
            icon={<FileText size={32} />}
            title="Tests Taken"
            count={24}
            duration={4}
          />
          <Card
            icon={<Clock size={32} />}
            title="Total Hours"
            count={30}
            duration={4}
            suffix="hrs"
          />
        </AuthorizedComponent>
      </div>
      <div className="mt-4 p-4 bg-white shadow rounded">
        <SeeNotice />
      </div>
    </div>
  );
};

interface CardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  duration: number;
  suffix?: string;
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  count,
  duration,
  suffix,
}) => (
  <div className="flex flex-col items-center p-4 bg-white shadow rounded text-center">
    <div className="mb-4 text-green-500">{icon}</div>
    <p className="text-xl font-semibold">{title}</p>
    <CountUp
      className="text-2xl font-bold text-green-500"
      start={0}
      end={count}
      duration={duration}
      suffix={suffix}
    />
  </div>
);

export default Dashboard;