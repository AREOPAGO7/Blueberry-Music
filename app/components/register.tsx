"use client";
import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      alert("Registered successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border border-zinc-300 dark:border-zinc-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-700 bg-transparent"
      />
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
        Register
      </button>
    </form>
  );
}
