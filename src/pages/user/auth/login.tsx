import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuth } from "../../../contexts/AuthContext";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { loginSchema, type LoginSchema } from "../../../validation/LoginSchema";
import axios from "axios";
import { getDefaultPathForRoles } from "../../../config/routes";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
  mutationFn: async (data: LoginSchema) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, data);
    return response.data;
  },
onSuccess: (data) => {
  login(data.data.user, data.data.token);
  const roles = data.data.user.roles.map((r:any) => r.name);
  navigate(getDefaultPathForRoles(roles), { replace: true });
},
  onError: () => {
    toast.error("Invalid Credentials");
  },
});

  const onSubmit = (data: LoginSchema) => mutation.mutate(data);

  return (
    <div className="min-h-screen dark:bg-black dark:text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label>Email</label>
              <Input
                type="email"
                {...register("email")}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label>Password</label>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
