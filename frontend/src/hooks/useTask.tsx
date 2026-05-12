import axios from "axios";
import { useState, useCallback, useEffect } from "react";

interface Task {
  _id: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
}

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const previousTasks = tasks;

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/", {
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
      await axios.post("http://localhost:3001/", task, {
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
      await axios.delete(`http://localhost:3001/${id}`, {
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
      await axios.put(`http://localhost:3001/${id}`, updatedData, {
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

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    DeleteTask,
    UpdateTask,
  };
}
