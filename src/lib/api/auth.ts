import api from "./client";

export const AuthService = {
  login(data: { email: string; password: string }) {
    return api.post("/api/v1/login", data);
  },

  register(data: any) {
    return api.post("/api/v1/register", data);
  },
};
