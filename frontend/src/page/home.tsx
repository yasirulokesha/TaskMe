import {
  IconButton,
  OutlinedButton,
  PrimaryButton,
} from "../components/buttonVarients";
import { IoMdAdd } from "react-icons/io";
import useTasks from "../hooks/useTask";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";

type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  completed: boolean;
};

export default function Home() {
  const [createForm, setCreate] = useState(false);
  const { tasks, loading, error, createTask, DeleteTask } = useTasks();
  const typedTasks = tasks as Task[];
  

  return (
    <div className="w-full ">
      {createForm && (
        <div className="absolute bg-black/20 w-full h-screen z-10 top-0 left-0 transition-all duration-300 ease-in-out ">
          <div className="w-full max-w-md bg-white overflow-hidden rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-fit min-h-40">
            <h1 className="bg-[#2B2D42] text-white p-3 px-10 text-center font-bold">
              Create Task
            </h1>
            <form
              className="p-4 px-7"
              onSubmit={async (e: any) => {
                e.preventDefault();
                await createTask({
                  title: e.target.title.value,
                  description: e.target.description.value,
                  dueDate: new Date(e.target.date.value).toISOString(),
                })
                  .then(() => {
                    setCreate(false);
                  })
                  .catch((err) => {
                    console.error("Error creating task:", err);
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
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent"
                />
              </div>

              <label className="font-medium mb-2 block">Description</label>
              <textarea
                placeholder="Description"
                id="description"
                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent"
              />
              <div className="flex justify-end gap-2">
                <OutlinedButton
                  text="Cancel"
                  onPress={() => {
                    setCreate(false);
                  }}
                />
                <button type="submit">
                  <PrimaryButton text="Save" onPress={() => {}} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-10">Home</h1>
      <IconButton
        text="Add Task"
        onPress={() => setCreate(true)}
        icon={<IoMdAdd size={20} />}
      />

      <div className="w-full h-full m-auto flex flex-col gap-4 mt-10">
        {loading && <p>Loading tasks...</p>}
        {error && <p className="">{error}</p>}
        {!loading && !error && typedTasks.length === 0 && (
          <p>No tasks found.</p>
        )}
        {!loading && !error && typedTasks.length > 0 && (
          <ul className="grid md:grid-cols-3 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {typedTasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between flex-col p-0 rounded-xl overflow-hidden min-h-40 bg-white shadow-xl drop-shadow-neutral-500 hover:outline-2  outline-[#2B2D42] outline-offset-2 ease-linear duration-200 max-w-sm max-h-50"
              >
                <h1 className="w-full bg-[#2B2D42] text-white p-3 px-7 font-bold flex flex-row justify-between items-center">
                  {task.title}
                  {task.dueDate && (
                    <span className="text-sm">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </h1>
                <p className="px-7 p-2 overflow-scroll">{task.description}</p>
                <div className="w-full justify-between mt-auto mb-0  flex flex-row items-center p-2 px-7 ">
                  <button onClick={() => {
                    DeleteTask(task._id);
                  }}>
                    <MdDeleteForever className="text-2xl text-[#E04747] float-right cursor-pointer mb-4" />
                  </button>
                  {/* <PrimaryButton
                    text="Done"
                    onPress={() => {
                      alert("View task details - Coming soon!");
                    }}
                  /> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
