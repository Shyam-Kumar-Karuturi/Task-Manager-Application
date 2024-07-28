import React from "react";
import { FaTimes } from "react-icons/fa";

interface AlertPopoverProps {
  message: string;
  onClose: () => void;
}

const AlertPopover: React.FC<AlertPopoverProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg flex items-center justify-between w-full max-w-sm">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <FaTimes />
      </button>
    </div>
  );
};

export default AlertPopover;
