import { useAuth } from "@/api/useAuth";
import React from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const tryLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="text-center flex flex-col justify-center items-center pt-36">
      <h2 className="font-semibold text-3xl text-center">
        Are you sure you want to log out? If yes,
      </h2>
      <div className="flex pt-8 space-x-8">
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          onClick={tryLogout}
        >
          Logout
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default Logout;
