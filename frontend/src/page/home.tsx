import { TaskViews } from "../components/taskOperation";
import { AddTask } from "../components/uiComponents";
import useTasks from "../hooks/useTask";

export default function Home() {
  const { tasks } = useTasks();
  const { pending, completed, overdue } = useTasks().filterTasks();

  const SummaryCategories = [
    {
      title: "Total Tasks",
      value: tasks.length,
      bg: "oklch(88.2% 0.059 254.128)",
      text: "oklch(45.7% 0.24 277.023)",
    },
    {
      title: "Pending Tasks",
      value: pending.length,
      bg: "oklch(92.4% 0.12 95.746)",
      text: "oklch(55.4% 0.135 66.442)",
    },
    {
      title: "Completed Tasks",
      value: completed.length,
      bg: "oklch(92.5% 0.084 155.995)",
      text: "oklch(59.6% 0.145 163.225)",
    },
    {
      title: "Overdue Tasks",
      value: overdue.length,
      bg: "oklch(94.1% 0.03 12.58)",
      text: "oklch(58.6% 0.253 17.585)",
    },
  ];

  return (
    <div className="w-full h-svh">
      <div className="flex md:flex-row flex-col flex-wrap w-full md:h-fit gap-4">
        <div className="md:h-auto  sm:overflow-y-scroll w-full shadow-2xl sm:p-10 p-4">
          <div className="flex justify-between items-center flex-wrap">
            <h1 className="text-3xl font-bold ">Dashboard</h1>
            <div className="flex gap-4 items-center">
              <a
                href="https://github.com/yasirulokesha/TaskMe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#2B2D42] h-9 text-white rounded-lg hover:bg-[#2b2b42d1] hover:shadow-xl transition-all font-medium text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                Star on GitHub
              </a>
              <AddTask />
            </div>
          </div>

          <div className="w-full grid flex-wrap md:grid-cols-4 grid-cols-2 justify-between items-center my-4 gap-5 ">
            {SummaryCategories.map((category, index) => (
              <div
                key={index}
                className="shadow-xl w-full bg-[${category.bg}] font-bold outline-2 -outline-offset-1 rounded-xl h-fit py-3 px-5 hover:scale-97  duration-300 ease-in-out animate-move-up"
                style={{
                  backgroundColor: `${category.bg}`,
                  color: `${category.text}`,
                  animationDuration: `${index * 200}ms`,
                }}
              >
                <h1 className="text-sm ">{category.title}</h1>
                <h1 className="text-3xl -mt-1">{category.value}</h1>
              </div>
            ))}
          </div>

          <h1 className="text-xl font-bold mt-10">Scheduled Tasks</h1>
          <hr className="my-4 w-full border-gray-300" />

          <TaskViews listOnly={true} />
        </div>
      </div>
    </div>
  );
}
