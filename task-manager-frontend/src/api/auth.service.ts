import { AxiosResponse } from 'axios';
import { Task } from '../types';
import axiosInstance from './axiosInstance';

interface RegistrationParams {
    name: string;
    email: string;
    phone_number: string;
    password: string;
}

export const register = async (userData: RegistrationParams) => {
    const response = await axiosInstance.post('users/register/', userData);
  return response.data;
};

interface LoginWithEmailParams {
    email: string;
    password: string;
  }
  
  interface LoginWithPhoneParams {
    phone_number: string;
    otp: string;
  }

  export const loginWithEmail = async (params: LoginWithEmailParams) => {
    const response = await axiosInstance.post('users/login/', params);
    return response.data;
  };
  
  export const loginWithPhone = async (params: LoginWithPhoneParams) => {
    const response = await axiosInstance.post('users/login-phone/', params);
    return response.data;
  };



// Fetch tasks
export const fetchTasks = async (handleTasksFiltered: (tasks: any) => void, setLoading: (loading: boolean) => void) => {
  setLoading(true);
  try {
    const response = await axiosInstance.get('tasks/', {
      params: {},
    });
    handleTasksFiltered(response.data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    setLoading(false);
  }
};

// Add or edit a task
export const handleTaskAdded = async (
  newTask: Omit<Task, 'id'>,
  currentTask: Task | null,
  tasks: Task[],
  setTasks: (tasks: Task[]) => void,
  setFilteredTasks: (tasks: Task[]) => void,
  setIsOpen: (isOpen: boolean) => void,
  setCurrentTask: (task: Task | null) => void,
  fetchTasks: () => Promise<void>
) => {
  try {
    const taskWithTimestamp: Omit<Task, 'id'> = {
      ...newTask,
      created_at: new Date().toISOString(),
    };
    let response: AxiosResponse<any, any>;
    if (currentTask) {
      // Editing an existing task
      response = await axiosInstance.put(`tasks/${currentTask.id}/`, taskWithTimestamp);
      setTasks(tasks.map((task) => (task.id === currentTask.id ? response.data : task)));
      setFilteredTasks(tasks.map((task) => (task.id === currentTask.id ? response.data : task)));
    } else {
      // Adding a new task
      response = await axiosInstance.post('tasks/', taskWithTimestamp);
      setTasks([...tasks, response.data]);
      setFilteredTasks([...tasks, response.data]);
    }
    setIsOpen(false);
    setCurrentTask(null);
    await fetchTasks();
  } catch (error) {
    console.error('Error adding/editing task:', error);
  }
};

// Delete a task
export const handleTaskDeleted = async (
  id: number,
  tasks: Task[],
  setTasks: (tasks: Task[]) => void,
  setFilteredTasks: (tasks: Task[]) => void,
  fetchTasks: () => Promise<void>
) => {
  try {
    await axiosInstance.delete(`tasks/${id}/`);
    setTasks(tasks.filter((task) => task.id !== id));
    setFilteredTasks(tasks.filter((task) => task.id !== id));
    await fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
