// context/AuthContext.tsx
"use client";

import { User } from "@/types";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";


type AuthContextType = {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/authUser"); // bikin endpoint yang return AuthUser()
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user ?? null);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};
