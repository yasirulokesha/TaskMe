import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import '../index.css'

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

export default function Calendar({
  setDate,
}: {
  setDate: (date: Date) => Promise<void>;
}) {
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
                }`}
                type="button"
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
