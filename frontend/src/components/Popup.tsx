import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";

interface PopupProps {
  message: string;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  showPopup: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, setShowPopup, showPopup }) => {
  const { resetAuthStatus } = useAuthStore();

  const handleClose = () => {
    setShowPopup(false);
    resetAuthStatus();
  };

  return (
    <>
      {showPopup && (
        <div className="fixed top-5 right-5 z-50 w-80">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              message === "Done Successfully"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span className="flex-1">{message}</span>
            <button onClick={handleClose} className="ml-4">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
