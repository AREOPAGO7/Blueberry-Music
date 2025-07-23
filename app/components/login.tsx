"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from 'primereact/button';
import { useToast } from '@/app/components/ToastProvider';
        
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      showToast({ severity: 'secondary', summary: 'Success', detail: 'logged in successfully ', life: 3000 })
      setEmail("");
      setPassword("");
      redirect('/');
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8 sm:p-20 bg-[var(--background)]">
         
      <div className="border border-zinc-700 p-10 rounded-lg w-full max-w-sm bg-white dark:bg-zinc-900 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-zinc-300 dark:border-zinc-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-700 bg-transparent"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-zinc-300 dark:border-zinc-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-700 bg-transparent"
          />
          <button
            type="submit"
            className="bg-zinc-700 text-white p-2 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
