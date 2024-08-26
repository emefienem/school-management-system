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
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/sign" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<CPDLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["Admin", "Teacher"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["Admin", "Teacher"]}>
                <Profile />
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
            path="/subject/student/attendance/:studentID/:subjectID"
            element={
              <ProtectedRoute roles={["Admin", "Teacher"]}>
                <StudentAttendance situation="Subject" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subject/student/marks/:studentID/:subjectID"
            element={
              <ProtectedRoute roles={["Admin", "Teacher"]}>
                <StudentExamMarks situation="Subject" />
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
            path="/teacher/complain"
            element={
              <ProtectedRoute roles={["Teacher"]}>
                <TeacherComplain />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/class"
            element={
              <ProtectedRoute roles={["Teacher"]}>
                <TeacherClassDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/class/student/:id"
            element={
              <ProtectedRoute roles={["Teacher"]}>
                <TeacherViewStudent />
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
