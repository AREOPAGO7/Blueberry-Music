"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/app/components/ToastProvider';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ 
    username?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
  }>({});
  
  const showToast = useToast();
  const router = useRouter();
  const { setUser } = useAuth();

  const validateForm = () => {
    const newErrors: { 
      username?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string; 
    } = {};

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (username.length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Account created successfully! Please sign in.', 
          life: 5000 
        });
        setUser(data.user);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        router.push('/');
      } else {
        showToast({ 
          severity: 'error', 
          summary: 'Error', 
          detail: data.message || 'Registration failed. Please try again.', 
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
          <h1 className="text-2xl font-semibold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join us and start your musical journey</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-3 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Username"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

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

            {/* Confirm Password Field */}
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-3 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Confirm Password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 px-4 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-white hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
