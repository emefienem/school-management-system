import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/api/useAuth";
import { Link } from "react-router-dom";
import * as Select from "@radix-ui/react-select";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const Login = () => {
  const [fields, setFields] = useState({
    email: "",
    password: "",
    rollNum: "",
    studentName: "",
  });
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, accessToken, getstatus, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Trying to login...");
    try {
      await login(fields, role);
      if (role === "student") {
        await login(
          {
            rollNum: fields.rollNum,
            studentName: fields.studentName,
            password: fields.password,
          },
          role
        );
      } else {
        await login({ email: fields.email, password: fields.password }, role);
      }
    } catch (error: any) {
      toast.error("Invalid login details. Please confirm!");
      // console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (getstatus === "success" && accessToken) {
      toast.success("Logged in successfully!", { duration: 2000 });
      navigate("/dashboard");
    } else if (getstatus === "error") {
      toast.error(error);
    }
  }, [getstatus, accessToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {role === "student" ? (
            <>
              <div>
                <label
                  htmlFor="rollNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNum"
                  value={fields.rollNum}
                  onChange={handleChange}
                  placeholder="Roll Number"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student Name
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={fields.studentName}
                  onChange={handleChange}
                  placeholder="Student Name"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="Email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={fields.password}
              onChange={handleChange}
              placeholder="Password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={handleRoleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-semibold rounded-md shadow bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
          <div className="flex items-center gap-x-1 text-[13px] justify-center">
            <p>Don't Have an Account?</p>
            <Link className="text-orange-500" to={"/signup"}>
              Create Account
            </Link>
          </div>
          <div className="text-[0.75rem] text-center">
            <Link to={"/forgot-password"}>Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
