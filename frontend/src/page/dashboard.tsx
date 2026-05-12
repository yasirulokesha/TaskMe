// import { useAuth } from "../hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import SideNavigation from "../components/sideNavigation";
import Home from "./home";
import logo from "../assets/logo.svg";

const Dashboard = () => {
  return (
    <div className="w-full overflow-visible h-screen flex flex-row m-0 p-0 ">
      <aside className="sticky h-full w-fit ">
        <SideNavigation />
      </aside>

      <aside className="flex-1 overflow-y-auto p-8">
        <img
          src={logo}
          className=" w-30 top-10 right-10 float-right absolute"
        />
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </aside>
    </div>
  );
};

export default Dashboard;
