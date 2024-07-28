import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ClipLoader } from "react-spinners";
import TaskList from "./TaskList";
import TaskFilter from "./TaskFilter";
import TaskForm from "./TaskForm";
import { Task } from "../types";
import {
  fetchTasks,
  handleTaskAdded,
  handleTaskDeleted,
} from "../api/auth.service";
import bgImage from "../assets/bg3.png";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    await fetchTasks({}, handleTasksFiltered, setLoading);
  };

  const handleTasksFiltered = (tasks: Task[]) => {
    setTasks(tasks);
    setFilteredTasks(tasks);
  };

  // Open edit task form
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsOpen(true);
  };

  return (
    <div
      className="relative min-h-screen bg-white"
      style={{
        // backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-50"></div>
      <div className="relative p-4 mx-auto flex flex-col items-center justify-center">
        <div className="flex justify-between items-center mb-6 w-full">
          <div
            className="p-4 mx-auto relative top-20 w-full"
            style={{ backgroundColor: "rgba(241, 245, 249, 0.6)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

              {/* Button to open the Task Form Popover */}
              <button
                onClick={() => {
                  setIsOpen(true);
                  setCurrentTask(null);
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
                  <div
                    className="fixed inset-0 bg-black/30"
                    aria-hidden="true"
                  />
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
                  <Dialog.Panel className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg mx-auto bg-white rounded-lg p-6 shadow-xl">
                      <TaskForm
                        task={currentTask}
                        onSubmit={(newTask) =>
                          handleTaskAdded(
                            newTask,
                            currentTask,
                            tasks,
                            setTasks,
                            setFilteredTasks,
                            setIsOpen,
                            setCurrentTask,
                            loadTasks
                          )
                        }
                        onCancel={() => {
                          setIsOpen(false);
                          setCurrentTask(null);
                        }}
                      />
                    </div>
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
              <div className="flex justify-center items-center h-64">
                <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={(id: number) =>
                  handleTaskDeleted(
                    id,
                    tasks,
                    setTasks,
                    setFilteredTasks,
                    loadTasks
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
