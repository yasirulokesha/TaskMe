import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.tsx";
import VerifyRoutes from "./components/verifyRoutes.tsx";
import Dashboard from "./page/dashboard.tsx";
import Landing from "./landing.tsx";
import LoadingScreen from "./components/loadingScreen.tsx";
import { useState } from "react";

export default function App() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleLogout = () => {
    setLoading(true);
    logout();
    window.location.href = "/";
    setLoading(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard/*"
          element={
            <VerifyRoutes>
              <Dashboard />
            </VerifyRoutes>
          }
        />
        <Route
          path="/logout"
          Component={() => {
            handleLogout();
            return null;
          }}
        />
      </Routes>
    </BrowserRouter>
  );
}
