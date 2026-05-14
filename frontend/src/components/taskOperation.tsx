import useTasks from "../hooks/useTask";
import { MdDelete } from "react-icons/md";
import StatusTip from "./statusTips";
import { SiGoogletasks } from "react-icons/si";
import { OutlinedButton, PrimaryButton } from "./buttonVarients";
import { useRef, useState } from "react";
import Calendar from "./uiComponents";

type Task = {
  _id: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
};

function TaskViews() {
  const { tasks, loading, error, DeleteTask, UpdateTask } = useTasks();
  const typedTasks = tasks as Task[];
  const pendingTasks = typedTasks.filter((task) => !task.completed);
  const completedTasks = typedTasks.filter((task) => task.completed);
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  const filteredTasks = filter === "pending" ? pendingTasks : completedTasks;

  return (
    <div className="w-full h-full m-auto flex flex-col gap-4">
      <div className="relative inline-flex items-center justify-center p-2 text-sm font-black text-[#2B2D42] bg-gray-200 w-fit rounded-xl duration-150 transition-all mt-6">
        <div
          className="absolute top-1 bottom-1  left-1 rounded-lg bg-[#2B2D42] shadow-md transition-transform duration-300 ease-out outline-3 outline-gray-400 -outline-offset-2"
          style={{
            transform: `translateX(${filter === "pending" ? "0%" : "100%"})`,
            width: `calc((100% - 0.5rem) / 2)`,
          }}
        />
        <button
          className={
            "relative z-4 w-[50%] px-4 py-1" +
            (filter === "pending" ? "  text-white" : " text-[#2B2D42]")
          }
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={
            "relative z-4 w-[50%] px-4 py-1" +
            (filter === "completed" ? "  text-white" : "  text-[#2B2D42]")
          }
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
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
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => {
              const getDateKey = (d: string | Date) => {
                const date = new Date(d);
                return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              };

              const currentDateKey = getDateKey(task.dueDate);
              const prevDateKey =
                index > 0 ? getDateKey(filteredTasks[index - 1].dueDate) : null;
              const isNewDate = currentDateKey !== prevDateKey;

              return (
                <div key={task._id}>
                  {isNewDate && (
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
                  <TaskModelView
                    task={task}
                    DeleteTask={DeleteTask}
                    UpdateTask={UpdateTask}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-center font-black w-full text-gray-500 mt-10">
              No {filter} tasks found.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}

type NewTask = Omit<Task, "_id" | "completed">;

function CreateTaskForm({ closeHandle }: { closeHandle: () => void }) {
  const { createTask } = useTasks();
  const [msg, setMsg] = useState("");
  const [date, setDate] = useState(null as Date | null);

  const dateRef = useRef<Date | null>(null);
  // const [calendar, setCalendar] = useState(false);

  console.log(msg);

  return (
    <div className="absolute bg-black/20 w-full h-screen z-10 top-0 left-0 transition-all duration-300 ease-in-out">
      <div className="z-0 w-full h-full" onClick={closeHandle} />
      <div className="w-full z-10 md:max-w-md bg-white rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-fit min-h-40">
        <h1 className="bg-[#2B2D42] text-white p-3 px-10 text-center font-bold rounded-t-xl">
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
              dueDate: new Date(e.target.date.value).toDateString(),
            };

            await createTask(newTask)
              .then(() => {
                closeHandle();
              })
              .catch((err) => {
                console.error("Error creating task:", err);
                setMsg("Failed to create task. Please try again.");
              });
          }}
        >
          <div className="flex flex-col justify-center items-left gap-0 my-4">
            <label className="font-bold text-md block">Task</label>
            <input
              type="text"
              id="title"
              placeholder="Task Title"
              className="inline-block w-full rounded-xl bg-white px-4 py-3 mb-2 shadow-xl ring-2 ring-[#2B2D42]/20 focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col justify-center items-left gap-4 my-2">
            <input
              type="date"
              name="date"
              id="taskDate"
              value={
                date
                  ? new Date().toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              className="inline-block w-full rounded-xl bg-white px-4 py-3 shadow-xl ring-2 ring-[#2B2D42]/20"
            />
            {
              <div className="sm:block hidden">
                <Calendar
                  setDate={async (date: Date) => {
                    setDate(date);
                    dateRef.current = date;
                    const dateInput = document.getElementById(
                      "taskDate",
                    ) as HTMLInputElement | null;
                    if (dateInput) {
                      dateInput.value = date.toISOString().split("T")[0];
                    }
                  }}
                />
              </div>
            }
          </div>

          <label className="font-bold text-md block">Notes</label>
          <textarea
            placeholder="Additional details about the task..."
            id="notes"
            className="inline-block w-full rounded-xl bg-white px-4 py-3 mb-2 shadow-xl ring-2 ring-[#2B2D42]/20 focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent"
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

const TaskModelView = ({
  task,
  DeleteTask,
  UpdateTask,
}: {
  task: Task;
  DeleteTask: (id: string) => void;
  UpdateTask: (id: string, task: Task) => void;
}) => {
  return (
    <div className="flex flex-row w-full gap-0.5">
      <div className="flex-1 hover:-outline-offset-4 outline-gray-400 hover:outline-2 text-white bg-[#2B2D42] duration-150 h-fit w-full rounded-xl">
        <div className="w-full py-3 px-7 flex flex-row justify-between items-center">
          <div className="flex-col">
            <h1 className="flex flex-col items-left text-lg font-bold">
              {task.title}
            </h1>
          </div>
          <div className="flex top-0 gap-4 ">
            {task.completed && <StatusTip type="completed" completedAt={""} />}
            {!task.completed && (
              <>
                <StatusTip
                  days={Math.ceil(
                    (new Date(task.dueDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  type="success"
                />
                <button
                  onClick={() => {
                    DeleteTask(task._id);
                  }}
                >
                  <MdDelete className="text-2xl text-[#E04747] float-right cursor-pointer " />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {!task.completed && (
        <div
          className="group flex-0 shrink-0 justify-center items-center  hover:-outline-offset-4 outline-gray-400 hover:outline-2 text-white bg-[#2B2D42] duration-150 h-full w-full rounded-xl p-4"
          onClick={() => {
            const updatedTask: Task = {
              _id: task._id,
              title: task.title,
              notes: task.notes,
              dueDate: task.dueDate,
              completed: !task.completed,
            };
            UpdateTask(task._id, updatedTask);
          }}
        >
          <div className="">
            <SiGoogletasks
              className={`text-2xl cursor-pointer text-white group-hover:text-green-500 duration-300 ease-in-out transition-all group-hover:scale-105 `}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { CreateTaskForm, TaskViews, TaskModelView };
