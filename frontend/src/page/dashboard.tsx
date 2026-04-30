import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideNavigation from "../components/sideNavigation";

const Dashboard = () => {
  return (
    <div className="w-full h-screen flex flex-row m-0 p-0 ">
      <SideNavigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </div>
  );
};

export default Dashboard;

const Home = () => {
  const { user, loading, logout, error } = useAuth();
  return (
    <div className="w-full ">
      <div className="w-full h-full m-auto flex flex-col justify-center items-center gap-4">
        <h1>Home</h1>
        <h1>Welcome, {user?.username}</h1>
        <h1>Welcome, {user?.email}</h1>
        <img
          src={`url(${user?.avatar})`}
          alt="Avatar"
          className="w-20 h-20 rounded-full"
        />
      </div>
    </div>
  );
};


const Tasks = () => {
  const { user, loading, logout, error } = useAuth();
  return (
    <div className="w-full ">
      <div className="w-full h-full m-auto flex flex-col justify-center items-center gap-4">
        <h1>Tasks</h1>
        <h1>Welcome, {user?.username}</h1>
        <h1>Welcome, {user?.email}</h1>
        <img
          src={`url(${user?.avatar})`}
          alt="Avatar"
          className="w-20 h-20 rounded-full"
        />
      </div>
    </div>
  );
};
