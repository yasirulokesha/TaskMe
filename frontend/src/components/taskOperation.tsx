import useTasks from "../hooks/useTask";
import { MdDelete } from "react-icons/md";
import StatusTip from "./statusTips";
import { FaCircleCheck } from "react-icons/fa6";
import { SiGoogletasks } from "react-icons/si";
import { OutlinedButton, PrimaryButton } from "./buttonVarients";

type Task = {
  _id: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
};

function TaskViews({
  filter,
}: {
  filter: "pending" | "completed";
}) {
  const { tasks, loading, error, DeleteTask, UpdateTask } = useTasks();
  const typedTasks = tasks as Task[];
  const pendingTasks = typedTasks.filter((task) => !task.completed);
  const completedTasks = typedTasks.filter((task) => task.completed);

  const filteredTasks = filter === "pending" ? pendingTasks : completedTasks;

  return (
    <div className="w-full h-full m-auto flex flex-col gap-4 mt-10">
      {loading && (
        <div className="animate-pulse flex flex-col items-center gap-6 w-full">
          <div className="h-10 bg-slate-400 w-full rounded-md"></div>
          <div className="h-10 bg-slate-400 w-full rounded-md"></div>
          <div className="h-10 bg-slate-400 w-full rounded-md"></div>
        </div>
      )}
      {!loading && !error && typedTasks.length === 0 && <p>No tasks found.</p>}
      {!loading && !error && typedTasks.length > 0 && (
        <ul className="flex flex-col w-full flex-wrap gap-6 justify-start">
          {filteredTasks.map((task, index) => {
            const prevDate = index > 0 ? typedTasks[index - 1].dueDate : null;
            const isNewdate = task.dueDate !== prevDate;
            return (
              <div key={task._id}>
                {isNewdate && (
                  <div className="flex flex-col  w-full">
                    <span className="text-lg font-bold ml-5 mt-5">
                      {new Date(task.dueDate).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <hr className="my-4 w-full border-gray-300" />
                  </div>
                )}
                <li className="flex flex-row w-full gap-4">
                  <div className="flex-1 hover:-outline-offset-4 outline-amber-50 outline-2 text-white bg-[#2B2D42] duration-150 h-fit w-full rounded-xl">
                    <div className="w-full py-3 px-7 flex flex-row justify-between items-center">
                      <div className="flex-col">
                        <h1 className="flex flex-col items-left text-lg font-bold">
                          {task.title}
                        </h1>
                        {task.notes && (
                          <details className="text-sm font-normal ">
                            <summary className="cursor-pointer  font-medium">
                              Notes
                            </summary>
                            <p className="mt-2 font-medium text-md">
                              {task.notes}
                            </p>
                          </details>
                        )}
                      </div>
                      <div className="flex items-center gap-4 ">
                        <button
                          onClick={() => {
                            DeleteTask(task._id);
                          }}
                        >
                          <MdDelete className="text-2xl text-[#E04747] float-right cursor-pointer " />
                        </button>

                        {task.completed && (
                          <StatusTip type="completed" completedAt={""} />
                        )}
                        {!task.completed && (
                          <StatusTip
                            days={Math.ceil(
                              (new Date(task.dueDate).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}
                            type="success"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="group flex-0 shrink-0 justify-center items-center  hover:-outline-offset-4 outline-amber-50 outline-2 text-white bg-[#2B2D42] duration-150 h-full w-full rounded-xl p-4"
                    onClick={() => {
                      const updatedTask = {
                        title: task.title,
                        notes: task.notes,
                        dueDate: task.dueDate,
                        completed: !task.completed,
                      };
                      UpdateTask(task._id, updatedTask);
                    }}
                  >
                    {/* <div className=""> */}
                    {task.completed ? (
                      <div className="">
                        <FaCircleCheck
                          className={`text-2xl  float-right cursor-pointer text-green-500 `}
                        />
                      </div>
                    ) : (
                      <div className="">
                        <SiGoogletasks
                          className={`text-2xl cursor-pointer text-white group-hover:text-green-500 duration-300 ease-in-out transition-all group-hover:scale-105 `}
                        />
                      </div>
                    )}
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      )}
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

export { CreateTaskForm, TaskViews };
