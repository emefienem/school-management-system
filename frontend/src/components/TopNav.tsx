import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "@/api/useAuth";
import { Bell, UserIcon } from "lucide-react";
import { notification } from "antd";
import { Link } from "react-router-dom";

export const TopNav = () => {
  const location = useLocation();
  const { currentRole, currentUser, noticeList } = useAuth();
  const notificationLength = noticeList ? noticeList.length : 0;

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    console.log(location.pathname);

    const savedProfile = localStorage.getItem(currentUser?.user?.id || "");
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfileImage(parsedProfile.profileImage);
    }
  }, [location]);

  const openNotifications = () => {
    noticeList.forEach((notice, index) => {
      notification.open({
        message: (
          <h2 className="text-orange-500 font-bold xl:text-2xl text-xl">
            {notice.title}
          </h2>
        ),
        description: (
          <div>
            <p className="text-gray-600 font-semibold xl:text-xl text-lg">
              {notice.details}
            </p>
            {index < noticeList.length - 1 && <hr className="my-2" />}
          </div>
        ),
        duration: 0,
        style: {
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        },
      });
    });
  };

  return (
    <div className="bg-white shadow-md h-16 p-4 w-full flex items-center justify-between sticky top-0 z-10">
      <p className="text-lg font-semibold text-gray-800 opacity-0 md:opacity-100">
        Dashboard
      </p>

      <div className="flex items-center space-x-4">
        <div
          role="button"
          className="relative w-10 h-10 hover:bg-neutral-200 transition-all rounded-full flex items-center justify-center"
          onClick={openNotifications}
        >
          <div className="absolute -right-1 -top-1 w-5 h-5 flex items-center justify-center bg-orange-500 text-white rounded-full">
            <p className="text-[10px]">{notificationLength}</p>
          </div>
          <Bell className="w-5 h-5 text-gray-700" />
        </div>
        <Link to={"/profile"}>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-end">
              <p className="font-medium text-gray-800">
                {currentUser?.user?.name}
              </p>
              <p className="text-[0.75rem] text-neutral-500 uppercase">
                {currentRole}
              </p>
            </div>
            {/* <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-600" />
            </div> */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-gray-600" />
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
