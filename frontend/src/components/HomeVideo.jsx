import React, { useState } from "react";
import { useNavigate } from "react-router";

const HomeVideo = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    if (input.trim()) {
      navigate(`/room/${input}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl mb-5 text-gray-800">Join a Video Room</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Enter your name"
        className="p-3 text-lg w-80 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 text-lg text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Join
      </button>
    </div>
  );
};

export default HomeVideo;
