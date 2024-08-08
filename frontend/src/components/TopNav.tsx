// import { useAuth } from "@/api/useAuth";
import { Bell } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation } from "react-router";

export const TopNav = () => {
  //   const { user } = useAuth();
  //   const location = useLocation();
  //   useEffect(() => {
  //     console.log(location.pathname);
  //   }, [location]);
  return (
    <div className="bg-white h-16 p-2 w-full flex items-center justify-end divide-x-2 divide-neutral-200 space-x-4 sticky top-0">
      {/* {location.pathname.toLowerCase().includes("das") &&
        location.pathname !== "DAS/Dashboard" &&
        !location.pathname.includes("CPD") && (
        )} */}
      <div
        role="button"
        className="w-7 hover:bg-neutral-200 transition-all hover:rounded-md flex items-center justify-center aspect-square relative"
      >
        <div className="w-4 h-4 rounded-full absolute -right-1 top-1 text-xs flex items-center justify-center bg-orange-500 text-white -translate-y-1/2">
          <p className="text-[10px]">7</p>
        </div>
        <Bell className="w-4 h-4 shrink ml-[1px]" />
      </div>
      <div className="">
        <div role="button" className="ml-4 flex space-x-2 items-center w-32">
          <div className="flex flex-col  justify-start">
            {/* {user.roles[user.roles.length - 1] === "AIRLINE" ? (
              <p className="font-semibold text-[0.75rem]">{user.airline}</p>
            ) : (
              <p className="font-semibold text-[0.75rem]">
                {user.firstName || "External User"}
              </p>
            )}
            <p className="text-[0.65rem] text-neutral-500">
              {user.roles[user.roles.length - 1]}
            </p> */}
            <p>Mike</p>
          </div>
        </div>
      </div>
    </div>
  );
};
