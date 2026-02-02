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
  CardHeader,
  CardDescription,
} from "../../../components/ui/card";

import { loginSchema, type LoginSchema } from "../../../validation/LoginSchema";
import { getDefaultPathForRoles } from "../../../config/routes";
import { AuthService } from "../../../lib/api";

const LoginPage = () => {
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
    mutationFn: AuthService.login,
    onSuccess: (data) => {
  login(data.data.user, data.data.token);
  const apiRoles = data?.data?.user?.roles ?? [];
  const roles =
    apiRoles.length && typeof apiRoles[0] === 'string'
      ? apiRoles
      : apiRoles.map((r: any) => r.name);
  navigate(getDefaultPathForRoles(roles), { replace: true });
},
    onError: () => {
      toast.error("Invalid Credentials");
    },
  });

  const onSubmit = (data: LoginSchema) => mutation.mutate(data);

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
              The World's Premier
              <span className="block bg-gradient-to-r from-green-300 via-green-200 to-green-300 bg-clip-text text-transparent mt-2">
                Reptile Marketplace
              </span>
            </h1>
            <p className="text-lg text-white/90 leading-relaxed drop-shadow-md max-w-md mx-auto">
              Connect with a global community of enthusiasts and manage your collection with ease.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white drop-shadow-lg">10k+</div>
              <div className="text-sm text-white/80 mt-1">Active Users</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white drop-shadow-lg">500+</div>
              <div className="text-sm text-white/80 mt-1">Species</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white drop-shadow-lg">100%</div>
              <div className="text-sm text-white/80 mt-1">Secure</div>
            </div>
          </div>

          {/* Additional trust indicators */}
          <div className="pt-6 flex items-center justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl border-0">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardDescription className="text-base uppercase font-semibold text-gray-600 dark:text-gray-400">
              Welcome back to the habitat
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="scales@example.com"
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

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-green-500/30 transition-all duration-200"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  New to SerpentMarket?
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/register")}
              className="w-full h-11 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 font-semibold rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-200"
            >
              Join the Community
            </button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          By signing in, you agree to our{" "}
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

export default LoginPage;