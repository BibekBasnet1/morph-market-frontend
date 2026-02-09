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
    mutationFn: AuthService.register,
    onSuccess: (_data, variables) => {
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      
      {/* Left Section - Full Background Image with Overlay */}
      <div className="md:w-1/2 hidden md:flex flex-col justify-center items-center relative overflow-hidden p-12">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/login-bg.jpg"
            alt="Reptile Marketplace"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-900/90 to-teal-900/95"></div>
          {/* Additional dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center space-y-8">

          {/* Headline */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              Join the Community
              <span className="block bg-gradient-to-r from-green-300 via-teal-200 to-green-300 bg-clip-text text-transparent mt-2">
                Start Your Journey
              </span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed drop-shadow-md max-w-md mx-auto">
              Create your account and gain access to the world's premier reptile marketplace.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Verified Marketplace</h3>
                <p className="text-white/70 text-sm">Connect with trusted sellers worldwide</p>
              </div>
            </div>

            <div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Secure Transactions</h3>
                <p className="text-white/70 text-sm">Safe and encrypted payment processing</p>
              </div>
            </div>

            <div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Global Community</h3>
                <p className="text-white/70 text-sm">Join 10,000+ reptile enthusiasts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl border-0">
          <CardHeader className="text-center space-y-3 pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
              Join SerpentMarket today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <Input
                  {...register("userName")}
                  placeholder="john_doe"
                  className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20"
                />
                {errors.userName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="you@email.com"
                  className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500/20"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-green-500/30 transition-all duration-200 mt-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full h-11 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 font-semibold rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-200"
            >
              Sign In
            </button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
            Terms of Service
          </a>
          {" "}and{" "}
          <a href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;