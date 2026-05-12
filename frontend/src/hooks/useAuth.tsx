import {createContext, useState, useEffect, useContext} from "react";
import axios from "axios";

interface User {
    username: string;
    email: string;
    avatar: string;
    theme: {
        background: string;
        text: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
    logout: () => {}
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3001/auth/user", { withCredentials: true });
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
            await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, { withCredentials: true });
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

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };