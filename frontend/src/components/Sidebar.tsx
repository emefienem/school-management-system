import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LucideIcon,
  LucideLayoutDashboard,
  MessageCircle,
  Settings,
  Ticket,
  ClipboardIcon,
  CopyX,
} from "lucide-react";
import { useAuth } from "@/api/useAuth";
import { cn } from "@/components/lib/utils";
import { BsThreeDots } from "react-icons/bs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logout from "./Logout";

type SidebarProps = {
  Icon: LucideIcon;
  title: string;
  to: string;
  allowedRoles: string[];
  mainMenu?: string;
};

const SidebarItem = ({
  Icon,
  title,
  to,
  allowedRoles,
  mainMenu = "abc",
}: SidebarProps) => {
  const { currentRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!allowedRoles.includes(currentRole || "") && allowedRoles[0] !== "*") {
    return null;
  }

  const isActive =
    location.pathname.includes(to) || location.pathname.includes(mainMenu);

  return (
    <div
      role="button"
      onClick={() => navigate(to)}
      className={cn(
        "w-full px-2 text-neutral-500 flex items-center h-10 my-2 hover:text-white transition-all",
        isActive && "bg-slate-700/40 rounded-lg text-white"
      )}
    >
      <Icon className="w-4 h-4 shrink mr-2" />
      <p className="text-sm">{title}</p>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();

  const tryLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col lg:w-[15vw] px-1 bg-blue-500 items-center overflow-y-auto sticky top-0 hidden md:block">
        <div className="flex flex-col mt-[40px] px-3 w-full flex-1 p-2">
          <SidebarItem
            to="/dashboard"
            title="Dashboard"
            Icon={LucideLayoutDashboard}
            allowedRoles={["Admin", "Teacher"]}
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
            to="/admin/students"
            title="Students"
            Icon={ClipboardIcon}
            allowedRoles={["Admin"]}
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
            allowedRoles={["Teacher"]}
          />
          <SidebarItem
            to="/teacher/complain"
            title="Complain"
            Icon={MessageCircle}
            allowedRoles={["Teacher"]}
          />
          {accessToken && accessToken !== "access" && (
            <div
              onClick={tryLogout}
              role="button"
              className="mt-auto px-2 flex items-center space-x-2 text-lightPink hover:bg-slate-100/10 rounded-md h-8 transition-all"
            >
              {/* <Logout className="w-4 h-4 shrink " /> */}
              <p className="text-sm">Logout</p>
            </div>
          )}
        </div>
      </div>
      <Sheet>
        <SheetTrigger className="fixed top-4 left-4 w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center md:hidden block">
          <BsThreeDots />
        </SheetTrigger>
        <SheetContent className="bg-blue-500 text-white">
          <div className="flex flex-col mt-[40px] px-3 w-full flex-1 p-2">
            <SidebarItem
              to="/dashboard"
              title="Dashboard"
              Icon={LucideLayoutDashboard}
              allowedRoles={["Admin", "Teacher"]}
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
              to="/admin/students"
              title="Students"
              Icon={ClipboardIcon}
              allowedRoles={["Admin"]}
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
              allowedRoles={["Teacher"]}
            />
            <SidebarItem
              to="/teacher/complain"
              title="Complain"
              Icon={MessageCircle}
              allowedRoles={["Teacher"]}
            />
            {accessToken && accessToken !== "access" && (
              <div
                onClick={tryLogout}
                role="button"
                className="mt-auto px-2 flex items-center space-x-2 text-lightPink hover:bg-slate-100/10 rounded-md h-8 transition-all"
              >
                {/* <Logout className="w-4 h-4 shrink " /> */}
                <p className="text-sm">Logout</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
