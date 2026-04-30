import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/authContext.tsx";
import VerifyRoutes from "./components/verifyRoutes.tsx";
import Dashboard from "./page/dashboard.tsx";
import Landing from "./landing.tsx";

export default function App() {
  const { logout } = useAuth();

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
            logout();
            window.location.href = "/";
            return null;
          }}
        />
      </Routes>
    </BrowserRouter>
  );
}
