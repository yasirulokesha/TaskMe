import axios from "axios";
import { useState, useCallback, useEffect } from "react";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/", {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks"+err);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      await fetchTasks();
    }
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
    }
  };

  const DeleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/${id}`, {
        withCredentials: true,
      });
      console.log("Task deleted successfully");
      window.location.reload();
      fetchTasks();
    } catch (err) {
        console.log(err);
      setError("Failed to delete task");
    }
  };

  return { tasks, loading, error, fetchTasks, createTask, DeleteTask };
}
