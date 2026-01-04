// import React, { createContext, useContext } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import useCookieStorage from "../utils/useCookieStorage";
// import type { AuthToken, User } from "../types/UserContextType";

// interface UserContextType {
//     user: User | null;
//     token: AuthToken | null;
//     isLoading: boolean;
//     login: (user: User, token: AuthToken, rememberMe?: boolean) => void;
//     logout: () => void;
// }

// const UserContext = createContext<UserContextType | null>(null);

// const UserProvider = ({ children }: { children: React.ReactNode }) => {
//     const { getCookie, setCookie, deleteCookie } = useCookieStorage();
//     const queryClient = useQueryClient();

//     const { data, isLoading } = useQuery({
//         queryKey: ["auth"],
//         queryFn: async () => {
//             const userCookie = getCookie("user");
//             const tokenCookie = getCookie("auth_token");

//             if (userCookie && tokenCookie) {
//                 try {
//                     return {
//                         user: JSON.parse(userCookie),
//                         token: JSON.parse(tokenCookie),
//                     };
//                 } catch {
//                     deleteCookie("user");
//                     deleteCookie("auth_token");
//                 }
//             }
//             return { user: null, token: null };
//         },
//         staleTime: Infinity,
//     });

//     const login = (user: User, token: AuthToken, rememberMe = false) => {
//         if (rememberMe) {
//             setCookie("user", JSON.stringify(user), token.expiresIn);
//             setCookie("auth_token", JSON.stringify(token), token.expiresIn);
//         }
//         queryClient.setQueryData(["auth"], { user, token });
//     };

//     const logout = () => {
//         deleteCookie("user");
//         deleteCookie("auth_token");
//         queryClient.setQueryData(["auth"], { user: null, token: null });
//     };

//     return (
//         <UserContext.Provider
//             value={{
//                 user: data?.user ?? null,
//                 token: data?.token ?? null,
//                 isLoading,
//                 login,
//                 logout,
//             }}
//         >
//             {children}
//         </UserContext.Provider>
//     );
// };

// const useUser = () => {
//     const ctx = useContext(UserContext);
//     if (!ctx) throw new Error("useUser must be used within a UserProvider");
//     return ctx;
// };

// export { UserProvider, useUser };
