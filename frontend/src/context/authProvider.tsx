import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContextStruct, type User } from "./authContext";

const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const userData = await axios.get(`${API_URL}/user`, { withCredentials: true });
        setUser(userData.data);
      } catch (err) {
        setError(`Failed to fetch user data - ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
    } catch (err) {
      setError(`Failed to log out ${err}`);
    }
  };

  return (
    <AuthContextStruct.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContextStruct.Provider>
  );
};

export { AuthContextStruct, AuthProvider };
