
import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosRequestConfig,
} from "axios";
import { useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

declare global {
    interface Window {
        appUrl?: string;
    }
}

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: `${window.appUrl}/api`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const usePrivateRequest = () => {
    const { token, logout } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (!config.headers["Authorization"] && token?.accessToken) {
                    config.headers["Authorization"] =
                        `Bearer ${token.accessToken}`;
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error),
        );

        const responseIntercept = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 403) {
                    console.warn("Access forbidden: Insufficient permissions");
                }
                return Promise.reject(error);
            },
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        };
    }, [token, logout]);

    const privateRequestApi = useCallback(async (config: AxiosRequestConfig) => {
        const response = await axiosInstance(config); 
        return response.data;
    }, []); 

    return { privateRequestApi };
};

export default usePrivateRequest;
