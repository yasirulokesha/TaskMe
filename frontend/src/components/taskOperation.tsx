import useTasks from "../hooks/useTask";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import StatusTip from "./statusTips";

type Task = {
  _id: string;
  title: string;
  notes: string;
  dueDate: string;
  completed: boolean;
};

export default function TaskViews({
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
                <li className="hover:-outline-offset-4 outline-amber-50 outline-2 text-white bg-[#2B2D42] rounded-xl overflow-hidden duration-150 ease-linear transition-all h-fit hover:scale-[1.006] ">
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
                      <IoCheckmarkDone
                        className={`text-2xl  float-right cursor-pointer ${task.completed ? "text-green-500" : "text-gray-400"}`}
                        onClick={() => {
                          const updatedTask = {
                            title: task.title,
                            notes: task.notes,
                            dueDate: task.dueDate,
                            completed: !task.completed,
                          };
                          UpdateTask(task._id, updatedTask);
                        }}
                      />
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
                      <StatusTip
                        days={Math.ceil(
                          (new Date(task.dueDate).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                        type="success"
                      />
                    </div>
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
