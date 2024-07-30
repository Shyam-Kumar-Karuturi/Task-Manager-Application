import React from "react";
import { FaTimes } from "react-icons/fa";

interface AlertPopoverProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const AlertPopover: React.FC<AlertPopoverProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  if (!message) return null;
  if (!isOpen) return null;
  return (
    <div className="fixed top-24 right-4 bg-red-500 text-white p-4 rounded shadow-lg flex items-center justify-between w-full max-w-sm">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <FaTimes />
      </button>
    </div>
  );
};

export default AlertPopover;
