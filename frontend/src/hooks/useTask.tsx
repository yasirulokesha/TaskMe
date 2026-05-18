import axios from "axios";
import { useState, useCallback, useEffect } from "react";

interface Task {
  _id: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const previousTasks = tasks;

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks" + err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTasks();
      setLoading(false);
    };
    fetchData();
  }, [fetchTasks]);

  const createTask = async (task: {
    title: string;
    notes: string;
    dueDate: string;
  }) => {
    try {
      await axios.post(`${API_URL}`, task, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log("Task created successfully");
      window.location.reload();
      fetchTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to create task");
      setTasks(previousTasks);
    }
  };

  const DeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      console.log("Task deleted successfully");
      // window.location.reload();
    } catch (err) {
      console.log(err);
      setError("Failed to delete task");
      setTasks(previousTasks);
    }
  };

  const UpdateTask = async (
    id: string,
    updatedData: {
      title: string;
      notes: string;
      dueDate: string;
      completed: boolean;
    },
  ) => {
    const previousTasks = tasks;
    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updatedData } : t)),
    );
    try {
      await axios.put(`${API_URL}/${id}`, updatedData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log("Task updated successfully");
      fetchTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to update task");
      setTasks(previousTasks);
    }
  };

  const DaysRemaining = (task: Task) =>
    Math.ceil(
      (new Date(task.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

  const filterTasks = () => {
    const pending = tasks.filter((task) => !task.completed);
    const completed = tasks.filter((task) => task.completed);

    const overdue = pending.filter((task) => DaysRemaining(task) < 0);

    return { pending, completed, overdue };
  };

  return {
    tasks,
    loading,
    error,
    filterTasks,
    DaysRemaining,
    fetchTasks,
    createTask,
    DeleteTask,
    UpdateTask,
  };
}
