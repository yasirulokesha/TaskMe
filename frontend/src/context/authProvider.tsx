import { useState, useEffect} from "react";
import axios from "axios";
import { AuthContext, type User } from "./authContext";

const API_URL = import.meta.env.VITE_API_URL;


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/auth/user`, { withCredentials: true });
                console.log('User data fetched successfully:', response.data.username);
                setUser(response.data);
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
        <AuthContext.Provider value={{ user, loading, error, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };