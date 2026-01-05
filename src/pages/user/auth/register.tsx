import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { registerSchema, type RegisterSchema } from "../../../validation/RegisterSchema";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { AuthService } from "../../../lib/api";
type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
            defaultValues: {
            name: "",
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
  });

  const mutation = useMutation({
    mutationFn:AuthService.register,
    onSuccess: (_data,variables) => {
      localStorage.setItem("email", variables.email);
    navigate("/verifyOtp");
  },
    onError: (error: any) => {
      const data = error?.response?.data as ApiErrorResponse;
      
      if (data?.errors) {
        // Show first validation error
        const firstError = Object.values(data?.errors)[0]?.[0];
        console.log("there is an error");
    toast.error(firstError || "Registration failed");
  } else {
    toast.error(data?.message || "Registration failed");
  }
},
  });
const roleNames = user?.roles?.map(r => r.name) ?? [];

useEffect(() => {
  if (roleNames.includes("admin")) {
    navigate("/admin/dashboard");
  } else if (roleNames.includes("buyer")) {
    navigate("/");
  }
}, [roleNames]);

  const onSubmit = (data: RegisterSchema) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 dark:bg-black">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Start selling on SerpentMarket
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label>Full Name</label>
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label>Username</label>
                <Input
                  {...register("userName")}
                  placeholder="john_doe"
                />
                {errors.userName && (
                  <p className="text-sm text-red-500">{errors.userName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label>Email</label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="you@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label>Password</label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label>Confirm Password</label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? "Creating account..."
                  : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default RegisterPage;