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
  notes: string;
  dueDate: string;
  completed: boolean;
};

export default function Home() {
  const [createForm, setCreate] = useState(false);
  const { tasks, loading, error, DeleteTask, createTask } = useTasks();
  const typedTasks = tasks as Task[];
  const [status, setStatus] = useState("");
  // const tempDate = new Date().toISOString();

  return (
    <div className="w-full ">
      {createForm && (
        <CreateTaskForm
          closeHandle={() => setCreate(false)}
          msg={(msg) => setStatus(msg)}
          createTask={createTask}
        />
      )}
      <h1 className="text-2xl font-bold mb-10">Home</h1>
      <IconButton
        text="Add Task"
        onPress={() => setCreate(true)}
        icon={<IoMdAdd size={20} />}
      />

      <div className="w-full h-full m-auto flex flex-col gap-4 mt-10">
        {loading && <p>Loading tasks...</p>}
        {status && <p className="text-green-500">{status}</p>}
        {!loading && !error && typedTasks.length === 0 && (
          <p>No tasks found.</p>
        )}
        {!loading && !error && typedTasks.length > 0 && (
          <ul className="flex flex-col w-full flex-wrap gap-6 justify-start">
            {typedTasks.map((task) => (
              <div key={task._id}>
                {}
                {task.dueDate  &&  (
                  <span className="text-lg font-bold ml-6 -mb-5">
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                <li
                  
                  className="flex 
                  justify-between 
                  flex-col 
                  p-0 
                  rounded-xl 
                  overflow-hidden
                bg-white shadow-xl drop-shadow-neutral-500 hover:outline-3 outline-0  outline-[#2b2d427e] outline-offset-0  ease-linear duration-150 h-fit hover:scale-[1.008] transition-all "
                >
                  <div className="w-full p-4 px-7 flex flex-row justify-between items-center">
                    <div className="flex-col">
                      <h1 className="flex flex-col items-left text-lg font-bold">
                        {task.title}
                      </h1>
                      {task.notes && (
                        <details className="text-sm font-normal  text-black">
                          <summary className="cursor-pointer text-[#8D99AE] font-medium">
                            Notes
                          </summary>
                          <p className="mt-2 font-medium text-md">{task.notes}</p>
                        </details>
                      )}
                    </div>

                    <div className="flex items-center gap-4 ">
                      <button
                        onClick={() => {
                          DeleteTask(task._id);
                        }}
                      >
                        <MdDeleteForever className="text-2xl text-[#E04747] float-right cursor-pointer " />
                      </button>
                      <PrimaryButton
                        text="Done"
                        onPress={() => {
                          alert("View task details - Coming soon!");
                        }}
                      />
                    </div>
                  </div>

                  {/* <h1 className="w-full bg-[#2B2D42] text-white p-3 px-7 font-bold flex flex-row justify-between items-center">
                    {task.title}
                    <button
                      onClick={() => {
                        DeleteTask(task._id);
                      }}
                    >
                      <MdDeleteForever className="text-2xl text-[#E04747] float-right cursor-pointer " />
                    </button>
                  </h1> */}
                  {/* <p className="px-7 p-2 overflow"> */}
                  {/* <details>
                      <summary>notes</summary> */}
                  {/* <p>{task.notes}</p> */}
                  {/* </details> */}
                  {/* </p> */}
                  {/* <div className="w-full justify-between mt-auto mb-0  flex flex-row items-center p-2 px-7 "> */}
                  {/* <PrimaryButton
                    text="Done"
                    onPress={() => {
                      alert("View task details - Coming soon!");
                    }}
                  /> */}
                  {/* </div> */}
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
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
