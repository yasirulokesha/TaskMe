import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import "../index.css";
import { CreateTaskForm } from "./taskOperation";
import { IconButton } from "./buttonVarients";
import { IoMdAdd } from "react-icons/io";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function Calendar({ setDate }: { setDate: (date: Date) => Promise<void> }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today)); // Feb 2024
  const [selected, setSelected] = useState(new Date(today));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of month and how many days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Build a 6x7 grid of date cells
  const cells: { date: Date; inMonth: boolean }[] = [];

  // Leading days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      inMonth: false,
    });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  // Trailing days from next month to fill 42 cells
  while (cells.length < 42) {
    const offset = cells.length - (firstDayOfMonth + daysInMonth) + 1;
    cells.push({ date: new Date(year, month + 1, offset), inMonth: false });
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div>
      <div
        className={` sm:relative absolute block rounded-2xl bg-white p-5 shadow-xl ring-2 ring-[#2B2D42]/20`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              goPrev();
            }}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            aria-label="Previous month"
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-base font-bold text-gray-800">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => {
              goNext();
            }}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Next month"
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Weekday row */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="flex h-9 w-9 items-center justify-center text-sm text-slate-800 font-bold"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map(({ date, inMonth }, i) => {
            const isAvailable = date > today || isSameDay(date, today);
            const isSelected = isSameDay(date, selected);
            return (
              <button
                key={i}
                onClick={() => {
                  setSelected(date);
                  setDate(date);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                  isSelected
                    ? "bg-[#2B2D42] font-medium text-white"
                    : inMonth
                      ? "text-slate-800 hover:bg-slate-300"
                      : "text-slate-300 hover:bg-slate-800/50"
                }
                ${
                  !isAvailable &&
                  "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-gray-200 disabled:hover:bg-transparent"
                }
                      `}
                type="button"
                disabled={!isAvailable}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ToolTip = ({ msg }: { msg: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [msg]);

  return (
    visible && (
      <div className="animation-move-up absolute text-md z-100 w-fit bottom-8 left-1/2 -translate-x-1/2 bg-red-500 outline-3 outline-offset-1 outline-red-400 text-white rounded-md px-4 py-2 opacity-100 pointer-events-none">
        {msg}
      </div>
    )
  );
};

type SortOrder = "asc" | "desc";

const SortDropdown = ({
  value,
  onChange,
}: {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const options: { value: SortOrder; label: string; icon: React.ReactNode }[] =
    [
      { value: "asc", label: "Earliest to Oldest", icon: <FaSortAmountUp /> },
      { value: "desc", label: "Oldest to Earliest", icon: <FaSortAmountDown /> },
    ];

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-[#2B2D42] text-white rounded-lg hover:bg-[#3a3d5c] transition-colors text-sm"
      >
        <HiOutlineSwitchVertical className="text-base" />
        {value === "asc" ? "Earliest to Oldest" : "Oldest to Earliest"}
      </button>

      <div
        className={`absolute right-0 mt-2 w-40 bg-[#2B2D42] text-white rounded-lg shadow-lg overflow-hidden origin-top-right transition-all duration-150 ease-out ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
              window.localStorage.setItem("sortOrder", opt.value);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-[#3a3d5c] transition-colors ${
              value === opt.value ? "text-green-400" : ""
            }`}
          >
            <span className="text-base">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const LoadingSpinner = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    <div className="rounded-xl absolute top-0 z-100  bg-white/70 flex flex-col items-center gap-6 w-full h-full justify-center">
      <div className="rounded-full w-15 h-15 animate-spin outline-[#2B2D42] -outline-offset-4 outline-2 border-r-2 border-t-2   " />
      <p className="text-lg font-black animate-pulse">{loadingMessage}</p>
    </div>
  );
};

const AddTask = () => {
  const [createForm, setCreate] = useState(false);

  return createForm ? (
    <CreateTaskForm closeHandle={() => setCreate(false)} />
  ) : (
    <IconButton
      text="Add Task"
      onPress={() => setCreate(true)}
      icon={<IoMdAdd size={20} />}
      className="my-4"
    />
  );
};

export { Calendar, ToolTip, SortDropdown, LoadingSpinner, AddTask };
