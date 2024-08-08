import React, { useState } from "react";
import { Settings, X } from "lucide-react";

interface Action {
  icon: React.ReactNode;
  name: string;
  action: () => void;
}

interface Props {
  actions: Action[];
}

const QuickActionDial: React.FC<Props> = ({ actions }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-12 h-12 bg-green-900 rounded-full text-white focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="SpeedDial toggle"
      >
        {open ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
      </button>
      {open && (
        <div className="absolute flex flex-col space-y-2 mt-2 left-full z-50">
          {actions.map((action) => (
            <button
              key={action.name}
              className="flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-full shadow text-gray-800 hover:bg-gray-100 focus:outline-none overflow-hidden"
              onClick={action.action}
              aria-label={action.name}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickActionDial;
