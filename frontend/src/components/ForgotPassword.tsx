import React, { useState } from "react";
import { Steps, Divider } from "antd";
import { useAuth } from "@/api/useAuth";
import { Loader } from "lucide-react";
import Popup from "./function/Popup";
import { Navigate } from "react-router";
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  const { resetPassword, forgotPassword, verifyResetCode } = useAuth();

  const requestResetCode = async () => {
    if (!email) {
      setMessage("Please input your email address");
      setShowPopup(true);
      return;
    }
    setMessage("");
    setLoader(true);
    try {
      await forgotPassword(email);
      setMessage("Please check your inbox for the reset code");
      setShowPopup(true);
      setStep(1);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
      setShowPopup(true);
    } finally {
      setLoader(false);
    }
  };

  const verifyTheResetCode = async () => {
    if (!code) {
      setMessage("Please enter the reset code.");
      setShowPopup(true);
      return;
    }

    setMessage("");
    setLoader(true);
    try {
      await verifyResetCode(email, code);
      setStep(2);
    } catch (error) {
      console.error(error);
      setMessage("Invalid code. Please try again.");
      setShowPopup(true);
    } finally {
      setLoader(false);
    }
  };

  const resetThePassword = async () => {
    if (!newPassword) {
      setMessage("Please enter a new password.");
      setShowPopup(true);
      return;
    }

    setMessage("");
    setLoader(true);
    try {
      await resetPassword(email, code, newPassword);
      setMessage("Password reset successfully.");
      setShowPopup(true);
      setTimeout(() => {
        // setStep(0); // Reset to first step after success
        <Navigate to={"/login"} />;
        setLoader(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while resetting the password.");
      setShowPopup(true);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <Steps current={step}>
          <Steps.Step title="Request Reset Code" />
          <Steps.Step title="Verify Code" />
          <Steps.Step title="Reset Password" />
        </Steps>

        <Divider />

        {step === 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Forgot Password?
            </h2>
            <span>
              {" "}
              <span>
                Enter the email address associated with your account and we'll
                send you a link to reset your password.
              </span>
            </span>
            <input
              type="email"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={requestResetCode}
              disabled={loader}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {loader ? (
                <Loader className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Send Reset Code"
              )}
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Enter Reset Code
            </h2>
            <span>Check your email inbox for the the rest code</span>
            <input
              type="text"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={verifyTheResetCode}
              disabled={loader}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {loader ? (
                <Loader className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Reset Password
            </h2>
            <span>Please create a new password</span>
            <input
              type="password"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={resetThePassword}
              disabled={loader}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {loader ? (
                <Loader className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default ForgotPassword;
