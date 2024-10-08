import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// const queryClient = new QueryClient();
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../src/components/Login";
import { Signup } from "../src/components/SignUp";
import Home from "../src/components/LandingPage";
import { CPDLayout } from "../src/components/Layout";
import Dashboard from "../src/components/Dashboard";
import { useAuth } from "../src/api/useAuth";
import SeeComplains from "./components/admin/SeeComplains";
import AddNotice from "./components/admin/AddNotice";
import ShowNotices from "./components/admin/ShowNotices";
import ShowSubjects from "./components/admin/ShowSubjects";
import ViewSubject from "./components/admin/ViewSubject";
import ChooseClass from "./components/admin/ChooseClass";
import SubjectForm from "./components/admin/SubjectForm";
import StudentAttendance from "./components/admin/StudentAttendance";
import StudentExamMarks from "./components/admin/StudentExamMarks";
import AddClass from "./components/admin/AddClass";
import ShowClasses from "./components/admin/ShowClasses";
import ClassDetails from "./components/admin/ClassDetails";
import AddStudent from "./components/admin/AddStudent";
import ShowStudents from "./components/admin/ShowStudents";
import ViewStudent from "./components/admin/ViewStudent";
import ShowTeachers from "./components/admin/ShowTeachers";
import TeacherDetails from "./components/admin/TeacherDetails";
import ChooseSubject from "./components/admin/ChooseSubject";
import AddTeacher from "./components/admin/AddTeacher";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import TeacherClassDetails from "./components/teacher/TeacherClassDetails";
import TeacherViewStudent from "./components/teacher/TeacherViewStudent";
import TeacherComplain from "./components/teacher/TeacherComplain";
import Logout from "./components/Logout";
import StudentComplain from "./components/student/StudentComplain";
import ViewStudentAttendance from "./components/student/ViewStudentAttendance";
import StudentSubjects from "./components/student/StudentSubjects";
import ShowParents from "./components/admin/ShowParents";
import AddParent from "./components/admin/AddParent";
import ForgotPassword from "./components/ForgotPassword";
import ParentComplain from "./components/parent/ParentComplain";
import ViewChildren from "./components/parent/ViewChildren";
import PayFee from "./components/parent/PayFee";
import SetFee from "./components/admin/SetFee";
import Enroll from "./components/student/Enroll";
import Assignment from "./components/teacher/Assignment";
import StudentAssignment from "./components/student/StudentAssignment";
import TakeQuiz from "./components/student/TakeQuiz";
import VideoPage from "./components/VideoPage";
import HomeVideo from "./components/HomeVideo";
import ContactList from "./components/ContactList";
import Chat from "./components/Chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<CPDLayout />}>
          <Route path="/logout" element={<Logout />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["Admin", "teacher", "Parent", "Student"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["Admin", "teacher", "Parent", "Student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/set-fee"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <SetFee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complains"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <SeeComplains />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-notice"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AddNotice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ShowNotices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ShowSubjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects/subject/:classID/:subjectID"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ViewSubject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects/chooseclass"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ChooseClass situation="Subject" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-subject/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <SubjectForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-class"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AddClass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ShowClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/classes/class/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ClassDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/class/add-students/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AddStudent situation="Class" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-students"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AddStudent situation="Student" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ShowStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/student/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ViewStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-parents"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AddParent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/parents"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ShowParents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/student/attendance/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <StudentAttendance situation="Student" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/student/marks/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <StudentExamMarks situation="Student" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ShowTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers/teacher/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <TeacherDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers/chooseclass"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ChooseClass situation="Teacher" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin/teachers/choosesubject/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ChooseSubject situation="Norm" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers/choosesubject/:classID/:teacherID"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <ChooseSubject situation="Teacher" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers/addteacher/:id"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AddTeacher />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/class/student/attendance/:studentID/:subjectID"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <StudentAttendance situation="Subject" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/class/student/marks/:studentID/:subjectID"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <StudentExamMarks situation="Subject" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/complain"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <TeacherComplain />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/class"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <TeacherClassDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/class/student/:id"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <TeacherViewStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room"
            element={
              <ProtectedRoute roles={["teacher", "Student"]}>
                <HomeVideo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:id"
            element={
              <ProtectedRoute roles={["teacher", "Student"]}>
                <VideoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/enroll"
            element={
              <ProtectedRoute roles={["Student"]}>
                <Enroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/subjects"
            element={
              <ProtectedRoute roles={["Student"]}>
                <StudentSubjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute roles={["Student"]}>
                <ViewStudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/complain"
            element={
              <ProtectedRoute roles={["Student"]}>
                <StudentComplain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignment-test"
            element={
              <ProtectedRoute roles={["Student"]}>
                <StudentAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignment-test"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <Assignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/complain"
            element={
              <ProtectedRoute roles={["Parent"]}>
                <ParentComplain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/view-child"
            element={
              <ProtectedRoute roles={["Parent"]}>
                <ViewChildren />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/pay-fee"
            element={
              <ProtectedRoute roles={["Parent"]}>
                <PayFee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute roles={["Admin", "teacher", "Parent", "Student"]}>
                <ContactList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:contactEmail"
            element={
              <ProtectedRoute roles={["Admin", "teacher", "Parent", "Student"]}>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, currentRole } = useAuth();
  if (!currentUser || !roles.includes(currentRole)) {
    return <Navigate to={"*"} />;
  }

  return <>{children}</>;
};
