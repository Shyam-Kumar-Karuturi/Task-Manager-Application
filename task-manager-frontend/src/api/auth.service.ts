import { Task } from '../types';
import axiosInstance from './axiosInstance';
import store from './store';
import { updateAccessToken, clearTokens } from './authSlice';

// Function to refresh access token
const refreshAccessToken = async () => {
  const state = store.getState();
  const refreshToken = state.auth.refreshToken;

  if (refreshToken) {
    try {
      const response = await axiosInstance.post('users/token/refresh/', {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      store.dispatch(updateAccessToken(newAccessToken));

      return newAccessToken;
    } catch (error) {
      store.dispatch(clearTokens());
      window.location.href = '/login';
    }
  } else {
    store.dispatch(clearTokens());
    window.location.href = '/login';
  }
};

// Function to handle requests with token refresh logic
const axiosRequest = async (config: any) => {
  try {
    const response = await axiosInstance(config);
    return response;
  } catch (err) {
    const error = err as any; // Type assertion
    const originalRequest = config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      }
    }

    throw error;
  }
};

interface RegistrationParams {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export const register = async (userData: RegistrationParams) => {
  const config = {
    method: 'post',
    url: 'users/register/',
    data: userData,
  };
  const response = await axiosRequest(config);
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
  const config = {
    method: 'post',
    url: 'users/login/',
    data: params,
  };
  const response = await axiosRequest(config);
  return response.data;
};

export const loginWithPhone = async (params: LoginWithPhoneParams) => {
  const config = {
    method: 'post',
    url: 'users/login/',
    data: params,
  };
  const response = await axiosRequest(config);
  return response.data;
};

interface FetchTasksParams {
  title?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}

// Fetch tasks
export const fetchTasks = async (
  params: FetchTasksParams,
  handleTasksFiltered: (tasks: any) => void,
  setLoading: (loading: boolean) => void
) => {
  const config = {
    method: 'get',
    url: 'tasks/',
    params: params,
  };

  setLoading(true);
  try {
    const response = await axiosRequest(config);
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
  const taskWithTimestamp: Omit<Task, 'id'> = {
    ...newTask,
    created_at: new Date().toISOString(),
  };
  const config = currentTask
    ? { method: 'put', url: `tasks/${currentTask.id}/`, data: taskWithTimestamp }
    : { method: 'post', url: 'tasks/', data: taskWithTimestamp };

  try {
    const response = await axiosRequest(config);
    if (currentTask) {
      setTasks(tasks.map((task) => (task.id === currentTask.id ? response.data : task)));
      setFilteredTasks(tasks.map((task) => (task.id === currentTask.id ? response.data : task)));
    } else {
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
  const config = {
    method: 'delete',
    url: `tasks/${id}/`,
  };

  try {
    await axiosRequest(config);
    setTasks(tasks.filter((task) => task.id !== id));
    setFilteredTasks(tasks.filter((task) => task.id !== id));
    await fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
