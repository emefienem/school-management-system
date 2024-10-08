import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LucideIcon,
  LucideLayoutDashboard,
  MessageCircle,
  Settings,
  Ticket,
  ClipboardIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/api/useAuth";
import { BsThreeDots } from "react-icons/bs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type SidebarProps = {
  Icon: LucideIcon;
  title: string;
  to: string;
  allowedRoles: string[];
  mainMenu?: string;
  onClick?: () => void;
};

const SidebarItem = ({
  Icon,
  title,
  to,
  allowedRoles,
  mainMenu = "abc",
  onClick,
  onClose,
}: SidebarProps & { onClose?: () => void }) => {
  const { currentRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!allowedRoles.includes(currentRole || "") && allowedRoles[0] !== "*") {
    return null;
  }

  const isActive =
    location.pathname.includes(to) || location.pathname.includes(mainMenu);

  const handleClick = async () => {
    navigate(to);
    if (onClick) onClick();
    if (onClose) onClose();
  };
  return (
    <div
      role="button"
      onClick={handleClick}
      className={`w-full px-2 text-black flex items-center h-10 my-2 transition-all duration-75 ease-in-out ${
        isActive ? "bg-orange-500 text-white font-bold rounded-xl" : ""
      }`}
    >
      <Icon className="w-4 h-4 shrink mr-2" />
      <p className="text-sm">{title}</p>
    </div>
  );
};

const Sidebar = () => {
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="hidden md:flex md:w-[15vw] px-1 flex-col items-center overflow-y-auto sticky top-2">
        <div className="flex flex-col mt-[40px] px-3 w-full flex-1 p-2">
          <SidebarItem
            to="/dashboard"
            title="Dashboard"
            Icon={LucideLayoutDashboard}
            allowedRoles={["Admin", "teacher", "Parent", "Student"]}
          />
          <SidebarItem
            to="/admin/classes"
            title="Classes"
            Icon={ClipboardIcon}
            allowedRoles={["Admin"]}
          />
          <SidebarItem
            to="/admin/subjects"
            title="Subjects"
            Icon={ClipboardIcon}
            allowedRoles={["Admin"]}
          />
          <SidebarItem
            to="/admin/teachers"
            title="Teachers"
            Icon={ClipboardIcon}
            allowedRoles={["Admin"]}
          />
          <SidebarItem
            to="/admin/parents"
            title="Parents"
            Icon={ClipboardIcon}
            allowedRoles={["Admin"]}
          />
          <SidebarItem
            to="/admin/students"
            title="Students"
            Icon={ClipboardIcon}
            allowedRoles={["Admin"]}
          />
          <SidebarItem
            to="/messages"
            title="Messaging"
            Icon={ClipboardIcon}
            allowedRoles={["Admin", "teacher", "Parent", "Student"]}
          />
          <SidebarItem
            to="/admin/notices"
            title="Notices"
            Icon={ClipboardIcon}
            allowedRoles={["Admin"]}
          />
          <SidebarItem
            to="/admin/complains"
            title="Complaints"
            Icon={Ticket}
            allowedRoles={["Admin"]}
          />
          <SidebarItem
            to="/teacher/class"
            title="Class"
            Icon={ClipboardIcon}
            allowedRoles={["teacher"]}
          />

          <SidebarItem
            to="/assignment-test"
            title="C.A"
            Icon={ClipboardIcon}
            allowedRoles={["teacher"]}
          />
          <SidebarItem
            to="/room"
            title="Online class"
            Icon={ClipboardIcon}
            allowedRoles={["teacher", "Student"]}
          />
          <SidebarItem
            to="/teacher/complain"
            title="Complain"
            Icon={MessageCircle}
            allowedRoles={["teacher"]}
          />
          <SidebarItem
            to="/student/subjects"
            title="Subjects"
            Icon={ClipboardIcon}
            allowedRoles={["Student"]}
          />
          <SidebarItem
            to="/student/enroll"
            title="Enroll Subject"
            Icon={ClipboardIcon}
            allowedRoles={["Student"]}
          />
          <SidebarItem
            to="/student/assignment-test"
            title="C.A"
            Icon={ClipboardIcon}
            allowedRoles={["Student"]}
          />
          <SidebarItem
            to="/student/attendance"
            title="Attendance"
            Icon={ClipboardIcon}
            allowedRoles={["Student"]}
          />
          <SidebarItem
            to="/student/complain"
            title="Complain"
            Icon={MessageCircle}
            allowedRoles={["Student"]}
          />
          <SidebarItem
            to="/parent/complain"
            title="Complain"
            Icon={MessageCircle}
            allowedRoles={["Parent"]}
          />
          <SidebarItem
            to="/parent/view-child"
            title="Children"
            Icon={MessageCircle}
            allowedRoles={["Parent"]}
          />
          <SidebarItem
            to="/parent/pay-fee"
            title="School fees"
            Icon={MessageCircle}
            allowedRoles={["Parent"]}
          />
          {accessToken && accessToken !== "access" && (
            <SidebarItem
              to="/logout"
              title="Logout"
              Icon={LogOutIcon}
              allowedRoles={["Admin", "teacher", "Parent", "Student"]}
            />
          )}
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="fixed top-4 left-4 w-8 h-8 bg-orange-500 text-white  flex items-center justify-center md:hidden z-50 rounded-lg">
          <BsThreeDots />
        </SheetTrigger>
        <SheetContent side="left" className="p-4 bg-white text-black">
          <div className="flex flex-col mt-[40px] px-3 w-full flex-1 p-2">
            <SidebarItem
              to="/dashboard"
              title="Dashboard"
              Icon={LucideLayoutDashboard}
              allowedRoles={["Admin", "teacher", "Parent", "Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/admin/classes"
              title="Classes"
              Icon={ClipboardIcon}
              allowedRoles={["Admin"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/admin/subjects"
              title="Subjects"
              Icon={ClipboardIcon}
              allowedRoles={["Admin"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/admin/teachers"
              title="Teachers"
              Icon={ClipboardIcon}
              allowedRoles={["Admin"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/admin/parents"
              title="Parents"
              Icon={ClipboardIcon}
              allowedRoles={["Admin"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/admin/students"
              title="Students"
              Icon={ClipboardIcon}
              allowedRoles={["Admin"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/messages"
              title="Messaging"
              Icon={ClipboardIcon}
              allowedRoles={["Admin", "teacher", "Parent", "Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/admin/notices"
              title="Notices"
              Icon={ClipboardIcon}
              allowedRoles={["Admin"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/admin/complains"
              title="Complaints"
              Icon={Ticket}
              allowedRoles={["Admin"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/teacher/class"
              title="Class"
              Icon={ClipboardIcon}
              allowedRoles={["teacher"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/room"
              title="Online class"
              Icon={ClipboardIcon}
              allowedRoles={["teacher", "Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/assignment-test"
              title="C.A"
              Icon={ClipboardIcon}
              allowedRoles={["teacher"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/teacher/complain"
              title="Complain"
              Icon={MessageCircle}
              allowedRoles={["teacher"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/student/subjects"
              title="Subjects"
              Icon={ClipboardIcon}
              allowedRoles={["Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/student/enroll"
              title="Enroll"
              Icon={ClipboardIcon}
              allowedRoles={["Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/student/assignment-test"
              title="C.A"
              Icon={ClipboardIcon}
              allowedRoles={["Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/student/attendance"
              title="Attendance"
              Icon={ClipboardIcon}
              allowedRoles={["Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/student/complain"
              title="Complain"
              Icon={MessageCircle}
              allowedRoles={["Student"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/parent/complain"
              title="Complain"
              Icon={MessageCircle}
              allowedRoles={["Parent"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/parent/view-child"
              title="Children"
              Icon={MessageCircle}
              allowedRoles={["Parent"]}
              onClose={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/parent/pay-fee"
              title="School fees"
              Icon={MessageCircle}
              allowedRoles={["Parent"]}
              onClose={() => setIsOpen(false)}
            />
            {accessToken && accessToken !== "access" && (
              <SidebarItem
                to="/logout"
                title="Logout"
                Icon={LogOutIcon}
                allowedRoles={["Admin", "teacher", "Parent", "Student"]}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
