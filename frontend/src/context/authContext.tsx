import { createContext } from "react";

export interface User {
    username: string;
    email: string;
    avatar: string;
    theme: {
        background: string;
        text: string;
    };
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    logout: () => void;
}

export const AuthContextStruct = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
    logout: () => {}
});
