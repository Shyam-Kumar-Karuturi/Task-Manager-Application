import React, { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "../types";

interface Props {
  onTasksFiltered: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
}

const TaskFilter: React.FC<Props> = ({ onTasksFiltered, setLoading }) => {
  const [status, setStatus] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchFilteredTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/tasks/", {
          params: {
            status: status === "all" ? undefined : status,
            from_date: fromDate || undefined,
            to_date: toDate || undefined,
          },
        });
        onTasksFiltered(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
      }
      setLoading(false);
    };

    fetchFilteredTasks();
  }, [status, fromDate, toDate]);

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    if (toDate && new Date(newFromDate) > new Date(toDate)) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    setFromDate(newFromDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    if (fromDate && new Date(newToDate) < new Date(fromDate)) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    setToDate(newToDate);
  };

  return (
    <>
      {showAlert && (
        <div
          className="flex items-center p-4 mb-4 text-sm rounded-lg bg-red-100 text-red-700 border border-red-300"
          role="alert"
        >
          <svg
            className="w-5 h-5 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a1 1 0 011 1v7a1 1 0 01-2 0V3a1 1 0 011-1z" />
            <path d="M10 12a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1z" />
          </svg>
          <div>To Date cannot be earlier than From Date.</div>

          <button
            onClick={() => {
              setShowAlert(false);
            }}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="flex flex-wrap justify-between bg-white shadow-md rounded-md mb-6 p-4">
        <div className="w-[30%]">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="status"
          >
            Task Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="all">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="w-[30%]">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fromDate"
          >
            Due Date From
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="w-[30%]">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="toDate"
          >
            Due Date To
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
    </>
  );
};

export default TaskFilter;
