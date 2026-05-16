import useTasks from "../hooks/useTask";
import { MdDelete } from "react-icons/md";
import StatusTip from "./statusTips";
import { SiGoogletasks } from "react-icons/si";
import { OutlinedButton, PrimaryButton } from "./buttonVarients";
import { useState } from "react";
import { Calendar, LoadingSpinner, SortDropdown } from "./uiComponents";
import { MoreHorizontal } from "lucide-react";
import { RiEdit2Fill } from "react-icons/ri";

type Task = {
  _id: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
};

function TaskViews({ listOnly = false }: { listOnly?: boolean }) {
  const { tasks, loading, error, DeleteTask, UpdateTask } = useTasks();
  const typedTasks = tasks as Task[];
  const pendingTasks = typedTasks.filter((task) => !task.completed);
  const completedTasks = typedTasks.filter((task) => task.completed);
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  const filteredTasks = filter === "pending" ? pendingTasks : completedTasks;

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const descSortedTasks = filteredTasks.toReversed();

  const taskList = sortOrder === "asc" ? filteredTasks : descSortedTasks;

  return (
    <div className="w-full h-full m-auto flex flex-col gap-4">
      <div className="flex items-center justify-between w-full pr-4">
        {!listOnly && (
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
                "pending relative z-4 w-[50%] px-4 py-1" +
                (filter === "pending" ? "  text-white" : " text-[#2B2D42]")
              }
              onClick={() => {
                setFilter("pending");
              }}
            >
              Pending
            </button>
            <button
              className={
                "completed relative z-4 w-[50%] px-4 py-1" +
                (filter === "completed" ? "  text-white" : "  text-[#2B2D42]")
              }
              onClick={() => {
                setFilter("completed");
              }}
            >
              Completed
            </button>
          </div>
        )}

        <div className="relative inline-flex items-center justify-center p-2 text-sm font-black text-[#2B2D42]  w-fit rounded-xl duration-150 transition-all mt-6">
          <h1 className="font-bold mr-2">Sort :</h1>
          <SortDropdown value={sortOrder} onChange={setSortOrder} />
        </div>
      </div>

      {loading && (
        <div className="animate-pulse flex flex-col items-center gap-6 w-full">
          <div className="h-10 bg-slate-400 w-full rounded-md"></div>
          <div className="h-10 bg-slate-400 w-full rounded-md"></div>
          <div className="h-10 bg-slate-400 w-full rounded-md"></div>
        </div>
      )}
      {!loading && !error && typedTasks.length > 0 && (
        <ul className="flex flex-col w-full flex-wrap gap-6 justify-start">
          {taskList.length > 0 ? (
            taskList.map((task, index) => {
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
                    <div className="flex flex-col  w-full transition-all duration-300 ease-in-out animate-move-in">
                      <span className="text-lg font-bold ml-5 mt-5">
                        {new Date(task.dueDate).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <hr className="my-4 w-full border-gray-300" />
                    </div>
                  )}
                  <div
                    className={`animate-fade-in`}
                    style={{
                      transitionDuration: `${index * 100}ms`,
                    }}
                  >
                    <TaskModelView
                      task={task}
                      DeleteTask={DeleteTask}
                      UpdateTask={UpdateTask}
                    />
                  </div>
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

const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function CreateTaskForm({ closeHandle }: { closeHandle: () => void }) {
  const [isLoading, setLoading] = useState(false);
  const { createTask } = useTasks();
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
    submission?: string;
  }>({});
  const [inputDate, setDate] = useState(new Date());
  const [loadingMessage, setLoadingMessage] = useState("Creating Task...");

  const [calendar, setCalendarOpen] = useState(false);

  const createTaskHandle = async (
    e: React.FormEvent<HTMLFormElement>,
    formData: HTMLFormElement & {
      title: { value: string };
      notes: { value: string };
    },
  ) => {
    e.preventDefault();
    switch (true) {
      case !formData.title.value.trim():
        setErrors({ title: "Task cannot be empty." });
        setLoading(false);
        return;
      case inputDate === null || isNaN(inputDate.getTime()):
        setErrors({ dueDate: "Please select a due date." });
        setLoading(false);
        return;
      default:
        setErrors({});
    }

    const newTask: NewTask = {
      title: formData.title.value,
      notes: formData.notes.value,
      dueDate: new Date(inputDate).toDateString(),
    };

    await createTask(newTask)
      .then(() => {
        setLoadingMessage("Task created successfully!");
        setLoading(false);
      })
      .catch((err) => {
        setLoadingMessage("Failed to create task.");
        console.error("Error creating task:", err);
        setErrors({ submission: "Failed to create task. Please try again." });
      });

    closeHandle();
  };

  return (
    <div className="absolute bg-black/20 w-full h-screen z-10 top-0 left-0 transition-all duration-300 ease-in-out">
      <div className="z-0 w-full h-full" onClick={closeHandle} />
      <div className=" w-full z-10 md:max-w-md bg-white rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-fit min-h-40">
        {isLoading && <LoadingSpinner loadingMessage={loadingMessage} />}
        <h1 className="bg-[#2B2D42] text-white p-3 px-10 text-center font-bold rounded-t-xl text-xl">
          Create a Task
        </h1>
        <form
          className="p-4 px-7"
          onSubmit={(e) => {
            e.preventDefault();

            const formData = e.target as typeof e.target & {
              title: { value: string };
              notes: { value: string };
              dueDate: { value: HTMLInputElement };
            };
            setLoading(true);
            createTaskHandle(e, formData);
          }}
        >
          <div className="flex flex-col justify-center items-left gap-0">
            <label className="font-bold text-lg block mb-1 ml-4 ">Task</label>
            <input
              type="text"
              id="title"
              onFocus={() => setCalendarOpen(false)}
              placeholder="What is on your mind?"
              className={`inline-block w-full rounded-xl bg-white px-4 py-3 mb-2 shadow-xl ring-2 ring-[#2B2D42]/20 focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent
                ${errors.title ? "ring-red-500" : ""}`}
            />
            <span className="text-red-500 text-sm">{errors.title}</span>
          </div>

          <div className="flex flex-col justify-center items-left gap-4 my-2">
            <input
              type="date"
              name="date"
              id="taskDate"
              value={inputDate && toDateString(new Date(inputDate))}
              className={`
              inline-block w-full rounded-xl bg-white px-4 py-3 shadow-xl ring-2 ring-[#2B2D42]/20
              ${errors.dueDate ? "ring-red-500" : "focus:ring-[#2B2D42] focus:border-transparent focus:outline-none"}
              `}
              onFocus={() => setCalendarOpen(true)}
              onChange={() => {}}
            />

            <div className={`sm:block ${calendar ? "block" : "hidden"}`}>
              <Calendar
                setDate={async (date: Date) => {
                  setDate(date);
                }}
              />
            </div>
          </div>

          <label className="font-bold text-lg block mb-1 ml-4 mt-4">
            Notes
          </label>
          <textarea
            placeholder="Additional details about the task..."
            id="notes"
            onFocus={() => setCalendarOpen(false)}
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
  const [isUpdating, setUpdating] = useState(false);

  const DeleteTaskHandle = async (id: string) => {
    setUpdating(true);

    setTimeout(() => {
      DeleteTask(id);
    }, 400);
  };

  const CompleteTaskHandle = async (id: string) => {
    setUpdating(true);

    setTimeout(() => {
      UpdateTask(id, { ...task, completed: !task.completed });
    }, 400);
  };

  const DaysRemaining = Math.ceil(
    Math.ceil(
      (new Date(task.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const [taskDialog, setTaskDialog] = useState<Task | null>(null);

  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  const mergedTask = { ...task, ...updatedTask };

  return (
    <>
      {taskDialog && (
        <div className="absolute flex w-full h-screen z-100 top-0 left-0">
          <TaskDialogView
            task={taskDialog}
            visibility={(updates) => {
              setUpdatedTask((prev) => ({ ...prev, ...updates }));
              setTaskDialog(null);
            }}
            DeleteHandle={() => DeleteTaskHandle(mergedTask._id)}
            CompletionHandle={() => CompleteTaskHandle(mergedTask._id)}
          />
        </div>
      )}

      <div
        className={`flex flex-row w-full duration-300 transition-all gap-0.5 ${
          isUpdating ? "opacity-0  scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex-1 hover:-outline-offset-4 outline-gray-400 hover:outline-2 text-white bg-[#2B2D42] duration-150 h-fit w-full rounded-xl">
          <div className="w-full py-3 px-7 flex flex-row justify-between items-center">
            <div className="flex-col">
              <h1 className="flex flex-col items-left text-lg font-bold">
                {mergedTask.title}
              </h1>
            </div>
            <div className="flex top-0 gap-4 ">
              {mergedTask.completed && (
                <>
                  <StatusTip type="completed" />
                  <button
                    onClick={() => {
                      DeleteTaskHandle(mergedTask._id);
                    }}
                  >
                    <MdDelete className="text-2xl text-[#E04747] float-right cursor-pointer " />
                  </button>
                </>
              )}
              {!task.completed && DaysRemaining >= 0 && (
                <>
                  <StatusTip days={DaysRemaining} type="pending" />
                  <button
                    onClick={() => {
                      DeleteTaskHandle(task._id);
                    }}
                  >
                    <MdDelete className="text-2xl text-[#E04747] float-right cursor-pointer " />
                  </button>
                </>
              )}
              {!task.completed && DaysRemaining < 0 && (
                <>
                  <StatusTip days={DaysRemaining} type="overdue" />
                  <button
                    onClick={() => {
                      DeleteTaskHandle(task._id);
                    }}
                  >
                    <MdDelete className="text-2xl text-[#E04747] float-right cursor-pointer " />
                  </button>
                </>
              )}
              <div className="flex items-center justify-center p-1 w-8 h-8 rounded-md hover:text-gray-700 bg-white/30 cursor-pointer transition-colors duration-200">
                <MoreHorizontal
                  onClick={() => {
                    setTaskDialog(null);
                    setTaskDialog(task);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {!task.completed && (
          <div
            className="group flex-0 shrink-0 justify-center items-center  hover:-outline-offset-4 outline-gray-400 hover:outline-2 text-white bg-[#2B2D42] duration-150 h-full w-full rounded-xl p-4"
            onClick={() => CompleteTaskHandle(task._id)}
          >
            <SiGoogletasks
              className={`text-2xl cursor-pointer text-white group-hover:text-green-500 duration-300 ease-in-out transition-all group-hover:scale-105 `}
            />
          </div>
        )}
      </div>
    </>
  );
};

const TaskDialogView = ({
  task,
  visibility,
  DeleteHandle,
  CompletionHandle,
}: {
  task: Task;
  visibility: (task: Task) => void;
  DeleteHandle: () => void;
  CompletionHandle: () => void;
}) => {
  const UpdateTask = useTasks().UpdateTask;

  const [isLoading, setLoading] = useState(false);

  const DaysRemaining = Math.ceil(
    (new Date(task.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const TaskUpdateHandle = async (updatedTask: Task) => {
    setLoading(true);
    setTaskEdit(false);
    await UpdateTask(task._id, updatedTask);
    setLoading(false);
  };

  const [taskEdit, setTaskEdit] = useState(false);

  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  const isUpdated = JSON.stringify(task) !== JSON.stringify(updatedTask);

  return (
    <div className="absolute bg-black/20 w-full h-screen z-100 top-0 left-0 ">
      <div className="z-10 w-full h-full" />
      <div className=" w-full z-10 max-w-prose bg-white rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-fit min-h-40">
        {isLoading && <LoadingSpinner loadingMessage="Updating Task..." />}
        <div className="flex flex-col-reverse bg-[#2B2D42] items-bottom text-white p-3 px-10 rounded-t-xl text-xl h-40">
          <div className="inline-flex top-10 right-10 items-center gap-4 justify-center">
            <div className="flex-1">
              <StatusTip
                type={
                  task.completed
                    ? "completed"
                    : DaysRemaining >= 0
                      ? "pending"
                      : "overdue"
                }
                days={DaysRemaining}
              />
            </div>
            <div
              onClick={() => {
                DeleteHandle();
                visibility(task);
              }}
            >
              <MdDelete className=" text-2xl text-red-500 cursor-pointer" />
            </div>
            <div
              onClick={() => setTaskEdit(!taskEdit)}
              className={`text-2xl cursor-pointer rounded-lg p-2 ${taskEdit ? "text-green-400 bg-white/20" : "text-white bg-transparent"} transition-colors duration-300 ease-in-out`}
            >
              <RiEdit2Fill />
            </div>
          </div>

          <input
            id="task"
            name="task"
            className={`inline-block w-full border-0 mb-2 bg-transparent outline-none ${
              taskEdit
                ? "border-b-2 border-b-white"
                : "pointer-events-none select-none"
            }`}
            value={updatedTask.title}
            onChange={(e) =>
              setUpdatedTask({ ...updatedTask, title: e.target.value })
            }
            readOnly={!taskEdit}
            type="text"
          />
        </div>
        <div className="py-4 px-10 pb-10 h-full">
          <div className="text-black font-medium mt-2 text-md">
            <h1 className="font-bold text-lg">Due on:</h1>
            <input
              type="date"
              name="date"
              id="taskDate"
              value={
                updatedTask.dueDate &&
                toDateString(new Date(updatedTask.dueDate))
              }
              className={`
              inline-block w-full rounded-xl bg-white px-4 py-3 shadow-xl ring-2 ring-[#2B2D42]/20
              ${taskEdit ? "ring-[#2B2D42] focus:ring-[#2B2D42]" : "ring-transparent focus:ring-transparent"}
              `}
              onChange={(e) => {
                setUpdatedTask({ ...updatedTask, dueDate: e.target.value });
              }}
              readOnly={!taskEdit}
            />
          </div>

          <h1 className="font-bold text-lg">Notes</h1>
          <textarea
            className={`text-gray-700 mt-2 max-h-50 h-svh w-full overflow-y-scroll bg-white shadow-2xl ring-2 ring-[#2B2D42]/20 focus:outline-none focus:ring-2 focus:ring-[#2B2D42] focus:border-transparent rounded-xl p-4 ${taskEdit ? "ring-[#2B2D42] focus:ring-[#2B2D42]" : "ring-transparent focus:ring-transparent"}`}
            placeholder="Task description and details..."
            readOnly={!taskEdit}
            value={updatedTask.notes}
            onChange={(e) =>
              setUpdatedTask({ ...updatedTask, notes: e.target.value })
            }
          ></textarea>

          <div className="flex justify-end gap-2 mt-6">
            <OutlinedButton
              text="Close"
              onPress={() => {
                visibility(updatedTask);
              }}
            />
            {isUpdated ? (
              <PrimaryButton
                text="Save Changes"
                onPress={() => {
                  TaskUpdateHandle(updatedTask);
                }}
              />
            ) : (
              <div>
                {!task.completed ? (
                  <PrimaryButton
                    onPress={() => {
                      CompletionHandle();
                    }}
                    text="Mark as Completed"
                  />
                ) : (
                  <PrimaryButton
                    className="bg-red-500"
                    text="Mark as Incomplete"
                    onPress={() => {
                      CompletionHandle();
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreateTaskForm, TaskViews, TaskModelView, TaskDialogView };
