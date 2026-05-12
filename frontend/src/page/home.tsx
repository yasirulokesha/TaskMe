import {
  IconButton,
  OutlinedButton,
  PrimaryButton,
} from "../components/buttonVarients";
import { IoMdAdd } from "react-icons/io";
import useTasks from "../hooks/useTask";
import { useState } from "react";
import TaskViews from "../components/taskOperation";

type Task = {
  _id: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
};

export default function Home() {
  const [createForm, setCreate] = useState(false);
  const { createTask } = useTasks();
  // const [status, setStatus] = useState("");
  return (
    <div className="w-full ">
      {createForm && (
        <CreateTaskForm
          closeHandle={() => setCreate(false)}
          msg={() => {}}
          createTask={createTask}
        />
      )}
      <h1 className="text-2xl font-bold mb-10">Home</h1>
      <IconButton
        text="Add Task"
        onPress={() => setCreate(true)}
        icon={<IoMdAdd size={20} />}
      />

      <TaskViews/>
    </div>
  );
}

type NewTask = Omit<Task, "_id" | "completed">;

function CreateTaskForm({
  closeHandle,
  msg,
  createTask,
}: {
  closeHandle: () => void;
  msg: (msg: string) => void;
  createTask: (data: NewTask) => Promise<unknown>;
}) {
  return (
    <div className="absolute bg-black/20 w-full h-screen z-10 top-0 left-0 transition-all duration-300 ease-in-out ">
      <div className="w-full max-w-md bg-white overflow-hidden rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-fit min-h-40">
        <h1 className="bg-[#2B2D42] text-white p-3 px-10 text-center font-bold">
          Create Task
        </h1>
        <form
          className="p-4 px-7"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = e.target as typeof e.target & {
              title: { value: string };
              notes: { value: string };
              dueDate: { value: HTMLInputElement };
            };

            const newTask: NewTask = {
              title: formData.title.value,
              notes: formData.notes.value,
              dueDate: new Date(e.target.date.value).toISOString(),
            };

            await createTask(newTask)
              .then(() => {
                closeHandle();
              })
              .catch((err) => {
                console.error("Error creating task:", err);
                msg("Failed to create task. Please try again.");
              });
          }}
        >
          <div className="flex flex-row justify-center items-center gap-4 my-4">
            <label className="font-medium block">Date</label>
            <input
              type="date"
              id="date"
              placeholder="Date"
              className="w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent"
            />
          </div>
          <div className="flex flex-row justify-center items-center gap-4 my-4">
            <label className="font-medium block">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Task Title"
              className="w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent"
            />
          </div>

          <label className="font-medium mb-2 block">Notes</label>
          <textarea
            placeholder="notes"
            id="notes"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent"
          />
          <div className="flex justify-end gap-2">
            <OutlinedButton
              text="Cancel"
              onPress={() => {
                closeHandle();
              }}
            />
            <button type="submit">
              <PrimaryButton text="Save" onPress={() => {}} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
