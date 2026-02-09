import type { LoginSchema } from "../../validation/LoginSchema";
import type { RegisterSchema } from "../../validation/RegisterSchema";
import api from "./client";

export const AuthService = {
  async login(data: LoginSchema) {
    return api.post("/login", data).then(res => res.data);
  },
 register(data: RegisterSchema) {
    return api.post("/register", {
      name: data.name,
      username: data.userName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    });
  },
};
