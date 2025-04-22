"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "./actions";
import { MessageBox } from "@/components/MessageBox";

// Define message type
interface Message {
  type: "success" | "error" | "warning" | "info";
  text: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const router = useRouter();

  // Define the expected response type from login function
  interface LoginResponse {
    success: boolean;
    message: string;
    data?: any;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = (await login(formData)) as LoginResponse;

      if (response.success) {
        setMessage({
          type: "success",
          text: "Login successful! Redirecting to dashboard...",
        });
        router.push("/dashboard");
      } else {
        setMessage({
          type: "error",
          text: response.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-navy-800">
            Wholesale Management
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your invoices and customers
          </p>
        </div>

        {message && (
          <MessageBox
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        <form className="mt-8 space-y-6" action={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-navy-700"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-navy-900 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-navy-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-navy-900 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition duration-150 ease-in-out"
            >
              Sign in
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Not registered yet? </span>
            <Link
              href="/signup"
              className="font-medium text-navy-600 hover:text-navy-500"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
