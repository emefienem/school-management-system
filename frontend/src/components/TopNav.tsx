// import { useAuth } from "@/api/useAuth";
import { useAuth } from "@/api/useAuth";
import { Bell } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import SeeNotice from "./admin/SeeNotice";

export const TopNav = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
  }, [location]);
  const { currentRole, currentUser, noticeList } = useAuth();
  const notificationLength = noticeList && noticeList.length;
  return (
    <div className="bg-white h-16 p-2 w-full flex items-center justify-end divide-x-2 divide-neutral-200 space-x-4 sticky top-0">
      <p>Dashboard</p>

      <div
        role="button"
        className="w-7 hover:bg-neutral-200 transition-all hover:rounded-md flex items-center justify-center aspect-square relative"
      >
        <div className="w-4 h-4 rounded-full absolute -right-1 top-1 text-xs flex items-center justify-center bg-orange-500 text-white -translate-y-1/2">
          <p className="text-[10px]">{notificationLength}</p>
        </div>
        <Bell className="w-4 h-4 shrink ml-[1px]" />
      </div>
      <div className="">
        <div role="button" className="ml-4 flex space-x-2 items-center w-32">
          <div className="flex flex-col justify-start">
            <p>{currentUser?.user?.name}</p>
            <p className="text-[0.65rem] text-neutral-500 uppercase">
              {currentRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
