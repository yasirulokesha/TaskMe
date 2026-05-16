import { Route, Routes } from "react-router-dom";
import SideNavigation from "../components/sideNavigation";
import Home from "./home";
import logo from "../assets/logo-white.svg";
import TaskView from "./taskView";
import { useEffect } from "react";

const Dashboard = () => {

  // const [navigationVisible, setNavigationVisible] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - TaskMe";
  }, []);
  return (
    <div className="w-full overflow-visible h-screen flex flex-row m-0 p-0 ">
      <aside className="sm:sticky h-full w-fit absolute z-10 -translate-x-64 sm:translate-x-0 transition-transform duration-300 ease-in-out">
        <SideNavigation />
      </aside>

      <aside className="flex-1 overflow-y-auto p-8">
        <img
          src={logo}
          className=" w-30 top-10 right-10 float-right absolute"
        />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<TaskView />} />
        </Routes>
      </aside>
    </div>
  );
};

export default Dashboard;
