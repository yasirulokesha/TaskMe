import { IconButton } from "../components/buttonVarients";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import { CreateTaskForm, TaskViews } from "../components/taskOperation";

export default function Home() {
  const [createForm, setCreate] = useState(false);
  // const { createTask } = useTasks();

  return (
    <div className="w-full ">
      {createForm && (
        <CreateTaskForm
          closeHandle={() => setCreate(false)}
        />
      )}
      <h1 className="text-3xl font-bold mb-10">Home</h1>
      <IconButton
        text="Add Task"
        onPress={() => setCreate(true)}
        icon={<IoMdAdd size={20} />}
      />

      <TaskViews/>
    </div>
  );
}
