import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

// interface Task {
//     title: string;
//     description: string;
//     status: 'pending' | 'in-progress' | 'completed';
//     dueDate: string;
//     craetedAt: string;
//     updatedAt: string;
// }

// interface TaskContextType {
//     tasks: Task[];
//     loading: boolean;
//     error: string | null;
//     fetchTasks: () => void;
// }

// const TaskContext = createContext<TaskContextType>({
//     tasks: [],
//     loading: true,
//     error: null,
//     fetchTasks: () => {}
// });

// const TaskProvider = ({ children }: { children: React.ReactNode }) => {
//     const [tasks, setTasks] = useState<Task[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const fetchTasks = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/', { withCredentials: true });
//             setTasks(response.data);
//         } catch (err) {
//             setError('Failed to fetch tasks');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     return (
//         <TaskContext.Provider value={{ tasks, loading, error, fetchTasks }}>
//             {children}
//         </TaskContext.Provider>
//     );
// }

// const useTasks = () => React.useContext(TaskContext);

// export { TaskProvider, useTasks };

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/", {
        withCredentials: true,
      });
      setTasks(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (task: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    try {
      await axios.post("http://localhost:3000/", task, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log("Task created successfully");
      window.location.reload();
      fetchTasks();
    } catch (err: any) {
        console.log(err.message);
      setError("Failed to create task");
    }
  };

  const DeleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/${id}`, {
        withCredentials: true,
      });
      console.log("Task deleted successfully");
      window.location.reload();
      fetchTasks();
    } catch (err: any) {
        console.log(err.message);
      setError("Failed to delete task");
    }
  };

  return { tasks, loading, error, fetchTasks, createTask, DeleteTask };
}
