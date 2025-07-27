"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/app/components/ToastProvider';
import Link from "next/link";

export default function LoginPage() {
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
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
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
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-10">
          <Link 
            href="/"
            className="inline-flex items-center text-zinc-400 hover:text-[#0056CC] transition-colors mb-6 text-[15px] font-normal tracking-[-0.24px]"
          >
            <svg className="w-[18px] h-[18px] mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Home
          </Link>
          
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold text-white mb-2 tracking-[0.35px] leading-[1.14286]">
              Sign In
            </h1>
           
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#2a2a2a] rounded-[12px] p-6 shadow-sm border border-[#3a3a3a]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-semibold text-zinc-300 mb-2 tracking-[-0.08px]">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-[44px] px-4 bg-[#1a1a1a] border rounded-[8px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] transition-all duration-150 text-[15px] font-normal tracking-[-0.24px] ${
                    errors.email ? 'border-[#FF3B30]' : 'border-zinc-600'
                  }`}
                  style={{
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[13px] text-[#FF3B30] font-normal tracking-[-0.08px]">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[13px] font-semibold text-zinc-300 mb-2 tracking-[-0.08px]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-[44px] px-4 bg-[#1a1a1a] border rounded-[8px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] transition-all duration-150 text-[15px] font-normal tracking-[-0.24px] ${
                    errors.password ? 'border-[#FF3B30]' : 'border-zinc-600'
                  }`}
                  style={{
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[13px] text-[#FF3B30] font-normal tracking-[-0.08px]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[44px] bg-white text-black rounded-[22px] font-bold cursor-pointer hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-[15px] tracking-[-0.24px] flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-zinc-600"></div>
            <span className="px-3 text-[13px] text-zinc-400 font-normal tracking-[-0.08px]">or</span>
            <div className="flex-1 h-px bg-zinc-600"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-[13px] text-zinc-400 font-normal tracking-[-0.08px] leading-[1.38462]">
              Don't have an account?
            </p>
            <Link 
              href="/register" 
              className="inline-block mt-1 text-[15px] text-violet-500 hover:text-[#0056CC] font-normal tracking-[-0.24px] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-zinc-500 font-normal tracking-[0.06px] leading-[1.36364] max-w-[280px] mx-auto">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}