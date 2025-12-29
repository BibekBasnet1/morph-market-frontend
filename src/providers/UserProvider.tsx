import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "../utils/useLocalStorage";
import type { AuthToken, User } from "../types/UserContextType";

interface UserContextType {
    user: User | null;
    token: AuthToken | null;
    isLoading: boolean;
    login: (user: User, token: AuthToken, rememberMe?: boolean) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { getItem, setItem, removeItem } = useLocalStorage();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            const userData = getItem<{ user: User; token: AuthToken }>("auth");
            return userData || { user: null, token: null };
        },
        staleTime: Infinity,
    });

    const login = (user: User, token: AuthToken, rememberMe = true) => {
        const authData = { user, token };
        if (rememberMe) {
            setItem("auth", authData);
        }
        queryClient.setQueryData(["auth"], authData);
    };

    const logout = () => {
        removeItem("auth");
        queryClient.setQueryData(["auth"], { user: null, token: null });
    };

    return (
        <UserContext.Provider
            value={{
                user: data?.user ?? null,
                token: data?.token ?? null,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
};

export { UserProvider, useUser };
