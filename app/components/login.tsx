"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/app/components/ToastProvider';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const showToast = useToast();
  const router = useRouter();
  const { setUser } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Logged in successfully!', 
          life: 3000 
        });
        setUser(data.user);
        setEmail("");
        setPassword("");
        router.push('/');
      } else {
        showToast({ 
          severity: 'error', 
          summary: 'Error', 
          detail: data.message || 'Login failed. Please check your credentials.', 
          life: 5000 
        });
      }
    } catch (error) {
      showToast({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Network error. Please try again.', 
        life: 5000 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-2xl font-semibold text-white mb-2">Sign In</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-3 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-3 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 px-4 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link 
                href="/register" 
                className="text-white hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
