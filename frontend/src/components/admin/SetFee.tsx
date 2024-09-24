import React, { useState } from "react";
import { useAuth } from "@/api/useAuth";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const SetFee: React.FC = () => {
  const [duration, setDuration] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();
  const { currentUser, setFee } = useAuth();

  const handleSetFee = async () => {
    const durationNum = Number(duration);
    if (durationNum <= 0 || amount <= 0) {
      alert("Duration and amount must be positive numbers.");
      return;
    }
    try {
      await setFee(durationNum, amount, currentUser?.user?.id);
      alert("Fee structure set successfully");
    } catch (error) {
      alert("Error setting fee structure");
    }
  };

  return (
    <>
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white mb-8 cursor-pointer"
      />
      <div className="flex flex-col max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          Set Fee Structure
        </h1>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Duration (months)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSetFee}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Submit Fee Structure
        </button>
      </div>
    </>
  );
};

export default SetFee;
