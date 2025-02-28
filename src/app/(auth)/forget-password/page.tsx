"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = "https://amazon-colone-api.onrender.com/api/users";

export default function OTPAuth() {
  const [step, setStep] = useState<"generate" | "verify" | "reset">("generate");
  const { register, handleSubmit, reset } = useForm();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onGenerateOTP = async (data: any) => {
    try {
      setEmail(data.email);
      const res = await axios.post(`${API_BASE_URL}/generateotp`, { email: data.email });
      setMessage(res.data.message);
      setStep("verify");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error generating OTP");
    }
  };

  const onVerifyOTP = async (data: any) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/verifyotp`, { email, otp: data.otp });
      setMessage(res.data.message);
      setStep("reset");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error verifying OTP");
    }
  };

  const onResetPassword = async (data: any) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/forgotpassword`, {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      setMessage(res.data.message);
      reset();
      setStep("generate");
      router.push("/login");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">OTP Authentication</h2>
      {message && <p className="text-sm text-red-500">{message}</p>}
      {step === "generate" && (
        <form onSubmit={handleSubmit(onGenerateOTP)}>
          <input
            {...register("email", { required: true })}
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
        <form onSubmit={handleSubmit(onVerifyOTP)}>
          <input
            {...register("otp", { required: true })}
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
        <form onSubmit={handleSubmit(onResetPassword)}>
          <input
            {...register("otp", { required: true })}
            type="text"
            placeholder="Enter OTP again"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            {...register("newPassword", { required: true })}
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
