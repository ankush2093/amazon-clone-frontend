"use client";
import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await registerUser(email, password, username);

    setMessage(response.message);
    setIsSuccess(response.success);

    if (response.success) {
      setTimeout(() => {
        router.push("/login"); // Redirect to login after success
      }, 2000);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Register</h1>
      {message && (
        <p className={isSuccess ? "text-green-500" : "text-red-500"}>
          {message}
        </p>
      )}
      <form onSubmit={handleRegister} className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded">
          Register
        </button>
      </form>

      <Link href="/login">
        <p className="text-blue-500 mt-2">Go to Login</p>
      </Link>
    </div>
  );
}
