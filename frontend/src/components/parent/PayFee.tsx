import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/api/useAuth";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
const stripeUrl = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(stripeUrl);

const PayFee: React.FC = () => {
  const navigate = useNavigate();
  const [rollNum, setRollNum] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<string>("full");
  // const [totalFee, setTotalFee] = useState<number>(0);
  // const [outstandingAmount, setOutstandingAmount] = useState<number>(0);
  const { processFee, feeData } = useAuth();

  const handlePayment = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      alert("Stripe failed to load. Please try again later.");
      return;
    }

    try {
      await processFee(rollNum, amount, paymentType);

      const { paymentIntent } = feeData;

      if (paymentIntent) {
        const result = await stripe.confirmCardPayment(
          paymentIntent.client_secret
        );
        if (result.error) {
          alert(result.error.message);
        } else {
          if (result.paymentIntent?.status === "succeeded") {
            alert("Payment successful!");
          }
        }
      }
    } catch (error) {
      alert("Error processing payment");
    }
  };

  return (
    <>
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white mb-8 cursor-pointer"
      />
      <h2 className="bg-red-500 text-white text-center">
        Payment system is down
      </h2>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Pay School Fee</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Roll Number
          </label>
          <input
            type="number"
            placeholder="Enter Roll Number"
            value={rollNum}
            onChange={(e) => setRollNum(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Payment Type
          </label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="full">Full Payment </option>
            <option value="partial">Partial Payment </option>
          </select>
        </div>
        <button
          onClick={handlePayment}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Pay Fee
        </button>
      </div>
    </>
  );
};

export default PayFee;
