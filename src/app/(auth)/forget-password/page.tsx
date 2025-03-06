"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


// Define form types
type GenerateOTPForm = {
  email: string;
};

type VerifyOTPForm = {
  otp: string;
};

type ResetPasswordForm = {
  otp: string;
  newPassword: string;
};

export default function OTPAuth() {
  const [step, setStep] = useState<"generate" | "verify" | "reset">("generate");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Separate forms for each step
  const generateOTPForm = useForm<GenerateOTPForm>();
  const verifyOTPForm = useForm<VerifyOTPForm>();
  const resetPasswordForm = useForm<ResetPasswordForm>();

  const onGenerateOTP = async (data: GenerateOTPForm) => {
    try {
      setEmail(data.email);
      const res = await axios.post(`${baseUrl}/users/generateotp`, { email: data.email });
      setMessage(res.data.message);
      setStep("verify");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Error generating OTP");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  const onVerifyOTP = async (data: VerifyOTPForm) => {
    try {
      const res = await axios.post(`${baseUrl}/users/verifyotp`, { email, otp: data.otp });
      setMessage(res.data.message);
      setStep("reset");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Error verifying OTP");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    try {
      const res = await axios.post(`${baseUrl}/users/forgotpassword`, {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      setMessage(res.data.message);
      resetPasswordForm.reset();
      setStep("generate");
      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Error resetting password");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">OTP Authentication</h2>
      {message && <p className="text-sm text-red-500">{message}</p>}

      {step === "generate" && (
        <form onSubmit={generateOTPForm.handleSubmit(onGenerateOTP)}>
          <input
            {...generateOTPForm.register("email", { required: true })}
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded mb-2"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Generate OTP
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={verifyOTPForm.handleSubmit(onVerifyOTP)}>
          <input
            {...verifyOTPForm.register("otp", { required: true })}
            type="text"
            placeholder="Enter OTP"
            className="w-full p-2 border rounded mb-2"
          />
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
            Verify OTP
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)}>
          <input
            {...resetPasswordForm.register("otp", { required: true })}
            type="text"
            placeholder="Enter OTP again"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            {...resetPasswordForm.register("newPassword", { required: true })}
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 border rounded mb-2"
          />
          <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}
