import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
import { useAuth } from "@/api/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
export const Signup = () => {
  const [fields, setFields] = useState({
    schoolName: "",
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const nav = useNavigate();
  const handleChange = (e: any) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const toastId = toast.loading("Trying to create an account...");

    try {
      await register(fields, "admin");
      toast.success("Created account successfully!");
      nav("/login");
    } catch (error: any) {
      // toast.error(error || "An error occurred");
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label
              htmlFor="schoolname"
              className="block text-gray-700 font-bold mb-2 text-sm"
            >
              School Name
            </label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={fields.schoolName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2 text-sm"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={fields.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2 text-sm"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="relative mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2 text-sm"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 cursor-pointer text-sm text-gray-600 hover:text-gray-900  text-[0.65rem]"
            >
              {showPassword ? (
                <EyeOffIcon className="size-6" />
              ) : (
                <EyeIcon className="size-6" />
              )}
            </span>
          </div>
          <div className="flex items-center gap-x-1 text-[13px] justify-center">
            <p>Have an Account?</p>
            <Link className="text-orange-500 " to={"/login"}>
              Login
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-700 text-white font-bold rounded-md shadow-md hover:bg-orange-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
