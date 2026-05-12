import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { LuLayoutDashboard } from "react-icons/lu";
import logo from "../assets/logo-white.svg";
import { BiSolidDashboard } from "react-icons/bi";
import { FaRegClock, FaCircleInfo, FaGear } from "react-icons/fa6";
import { MdColorLens } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
const NAV_ITEMS = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard/home",
        icon: <MdSpaceDashboard />,
      },
      {
        label: "My tasks",
        path: "/dashboard/tasks",
        icon: <FaTasks />,
      },
      {
        label: "In progress",
        path: "/dashboard/progress",
        icon: <FaRegClock />,
      },
      {
        label: "Completed",
        path: "/dashboard/completed",
        icon: <SiTicktick />,
      },
    ],
  },
  {
    section: "profile",
    items: [
      {
        label: "Theme",
        path: "/dashboard/theme",
        badge: null,
        icon: <MdColorLens />,
      },
      {
        label: "About",
        path: "/about",
        badge: null,
        icon: <FaCircleInfo />,
      },
      {
        label: "Settings",
        path: "profile/settings",
        badge: null,
        icon: <FaGear />,
      },
      {
        label: "Logout",
        path: "/logout",
        badge: null,
        icon: <HiOutlineLogout />,
      },
    ],
  },
];

const SideNavigation = () => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();

  return (
    <nav
      className={` p-4 gap-3 h-full  overflow-hidden bg-[#2B2D42] text-white flex flex-col transition-normal ease-[cubic-bezier(0.4, 0, 0.2, 1)] duration-200 max-w-64 ${expanded ? "w-64" : "w-18"}`}
    >
      <div className="flex gap-2 items-center mt-2 transition-none animate-none">
        <button
          className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded-sm"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <BiSolidDashboard className="text-3xl" />
          ) : (
            <LuLayoutDashboard className="text-3xl" />
          )}
        </button>
        {expanded && (
          <img
            src={logo}
            alt="Logo"
            className="w-full max-w-25"
          />
        )}
      </div>

      {/* Nav items */}
      <div className="sm:flex flex-col gap-4 my-auto h-full justify-between hidden">
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <div className={section === "profile" ? "mt-auto mb-0 " : ""}>
              {items.map(({ label, path, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center h-full gap-2 p-2 my-2 rounded-md ${expanded? "w-full": "w-fit"} ${isActive ? "bg-[#414571] text-white" : "text-gray-300 hover:bg-gray-600"}`
                  }
                  title={!expanded ? label : ""}
                >
                  <div className="md:text-2xl text-xl">{icon}</div>
                  {expanded && <span className="nav-label">{label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer — user info */}
      <div className="mt-auto mb-4 transition-none animate-none">
        <div className="flex flex-row gap-2 items-center">
          <div className=" w-10 rounded-full overflow-hidden">
            {user?.avatar && (
              <img
                src={user?.avatar}
                alt="User Avatar"
                referrerPolicy="no-referrer"
                className="w-full rounded-full object-cover"
              />
            )}
          </div>
          {expanded && (
            <div className=" flex flex-col">
              <p className="text-sm text-white">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SideNavigation;
