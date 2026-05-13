import {
  IconButton,
} from "../components/buttonVarients";
import { IoMdAdd } from "react-icons/io";
import useTasks from "../hooks/useTask";
import { useState } from "react";
import  { CreateTaskForm } from "../components/taskOperation";

export default function Home() {
  const [createForm, setCreate] = useState(false);
  const { createTask } = useTasks();
  // const [status, setStatus] = useState("");
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  return (
    <div className="w-full ">
      {createForm && (
        <CreateTaskForm
          closeHandle={() => setCreate(false)}
          msg={() => {}}
          createTask={createTask}
        />
      )}
      <h1 className="text-3xl font-bold mb-10">Home</h1>
      <IconButton
        text="Add Task"
        onPress={() => setCreate(true)}
        icon={<IoMdAdd size={20} />}
      />

      <div className="flex flex-row gap-4 mt-6">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            filter === "pending"
              ? "bg-[#2B2D42] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            filter === "completed"
              ? "bg-[#2B2D42] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>


      {/* <TaskViews filter={filter} /> */}
    </div>
  );
}