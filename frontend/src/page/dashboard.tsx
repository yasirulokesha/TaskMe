import { useAuth } from "../hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import SideNavigation from "../components/sideNavigation";
import Home from "./home";
import logo from "../assets/logo.svg";

const Dashboard = () => {
  return (
    <div className="w-full h-screen flex flex-row m-0 p-0 overflow-hidden">
      <SideNavigation />
      <div className="w-full mx-10 my-8 p-4 flex justify-center overflow-scroll">
        <img
          src={logo}
          className=" w-30 top-10 right-10 float-right absolute"
        />
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

