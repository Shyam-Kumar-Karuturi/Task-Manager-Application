import React, { useState, Fragment } from "react";
import axios, { AxiosResponse } from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { ClipLoader } from "react-spinners";
import TaskList from "./TaskList";
import TaskFilter from "./TaskFilter";
import TaskForm from "./TaskForm";
import { Task } from "../types";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  // Filter tasks based on status
  const handleTasksFiltered = (tasks: Task[]) => {
    setFilteredTasks(tasks);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/tasks/", {
        params: {},
      });
      handleTasksFiltered(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
    }
    setLoading(false);
  };

  // Add or edit a task
  const handleTaskAdded = async (newTask: Omit<Task, "id">) => {
    try {
      const taskWithTimestamp: Omit<Task, "id"> = {
        ...newTask,
        created_at: new Date().toISOString(),
      };
      let response: AxiosResponse<any, any>;
      if (currentTask) {
        // Editing an existing task
        response = await axios.put(
          `http://localhost:8000/api/tasks/${currentTask.id}/`,
          taskWithTimestamp
        );
        setTasks(
          tasks.map((task) =>
            task.id === currentTask.id ? response.data : task
          )
        );
        setFilteredTasks(
          tasks.map((task) =>
            task.id === currentTask.id ? response.data : task
          )
        );
      } else {
        // Adding a new task
        response = await axios.post(
          "http://localhost:8000/api/tasks/",
          taskWithTimestamp
        );
        setTasks([...tasks, response.data]);
        setFilteredTasks([...tasks, response.data]);
      }
      setIsOpen(false);
      setCurrentTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error adding/editing task:", error);
    }
  };

  // Delete a task
  const handleTaskDeleted = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`);
      setTasks(tasks.filter((task) => task.id !== id));
      setFilteredTasks(tasks.filter((task) => task.id !== id));
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open edit task form
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsOpen(true);
  };

  return (
    <div className="p-4 mx-auto">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Task Manager</h1>

        {/* Button to open the Task Form Popover */}
        <button
          onClick={() => {
            setIsOpen(true);
            setCurrentTask(null);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          Add New Task
        </button>
      </div>

      {/* Task Form Popover */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setCurrentTask(null);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 -translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="absolute top-[25%] left-[35%] w-[30%] mx-auto max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
              <TaskForm
                task={currentTask}
                onSubmit={handleTaskAdded}
                onCancel={() => {
                  setIsOpen(false);
                  setCurrentTask(null);
                }}
              />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Task Filter */}
      <TaskFilter
        onTasksFiltered={handleTasksFiltered}
        setLoading={setLoading}
      />

      {/* Task List or Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={handleTaskDeleted}
        />
      )}
    </div>
  );
};

export default TaskManager;
