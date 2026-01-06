import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";
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

import { z } from "zod";
// import { useUser } from "../../../providers/UserProvider";
// import {getDefaultPathForRoles } from "../../../config/routes";
import { useAuth } from "../../../contexts/AuthContext";
import { getDefaultPathForRoles } from "../../../config/routes";



const verifyOtpSchema = z.object({
  otp: z.string().min(4, "OTP must be at least 4 digits"),
});

type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;


const verifyOtpApi = async (data: {
  otp: string;
  email: string;
}) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`, data);
  return response.data;
};


const VerifyOtpPage = () => {
  const navigate = useNavigate();
//   const location = useLocation();
  const { login } = useAuth();

  const email = localStorage.getItem("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const mutation = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (data) => {
      if (data?.user && data?.token) {
        login(data?.user, data?.token);
        toast.success("OTP verified successfully!");
const roleNames = data.user.roles.map((r: any) => r.name);
        const redirectPath = getDefaultPathForRoles(roleNames);
        navigate(redirectPath, { replace: true });
        // navigate("/login", { replace: true });
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Invalid OTP"
      );
    },
  });

  const onSubmit = (data: VerifyOtpSchema) => {
    if (!email) {
      toast.error("Missing email. Please register again.");
      return;
    }

    mutation.mutate({
      otp: data.otp,
      email,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 dark:bg-black">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
              We sent an OTP to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="space-y-2">
                <label>OTP Code</label>
                <Input
                  {...register("otp")}
                  placeholder="Enter OTP"
                />
                {errors.otp && (
                  <p className="text-sm text-red-500">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? "Verifying..."
                  : "Verify OTP"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Didn’t receive the code?{" "}
              <button className="text-primary hover:underline">
                Resend OTP
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
