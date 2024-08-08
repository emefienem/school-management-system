import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/api/useAuth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
export const Signup = () => {
  const [fields, setFields] = useState({
    schoolName: "",
    email: "",
    password: "",
    name: "",
  });

  const { register } = useAuth();

  const handleChange = (e: any) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    toast.loading("Trying to create an account...");

    try {
      await register(fields, "admin");
      <Navigate to={"/login"} />;
      toast.success("Create account successfully!");
    } catch (error: any) {
      toast.error(error || "An error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="schoolname"
          className="block text-gray-700 font-bold mb-2"
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
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
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
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
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
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 font-bold mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-x-1 text-[13px] justify-center">
        <p>Have an Account?</p>
        <Link className="text-blue-500 " to={"/login"}>
          Login
        </Link>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
      >
        Sign Up
      </button>
    </form>
  );
};