"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.replace("/books");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-6 py-10 text-[#25221e]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-[#25221e]/10 bg-white shadow-[0_25px_80px_rgba(74,59,44,0.12)] lg:grid-cols-2">
          <div className="hidden flex-col justify-between bg-[#e8dfd1] p-12 lg:flex">
            <div>
              <Link href="/" className="text-xl font-bold tracking-tight">
                Book<span className="text-[#8b5e3c]">Collection</span>
              </Link>

              <div className="mt-24 max-w-md">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b5e3c]">
                  Welcome back
                </p>

                <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight">
                  Your library is waiting for you.
                </h1>

                <p className="mt-6 text-lg leading-8 text-[#6b645b]">
                  Sign in and continue managing your personal collection of
                  books.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#777066]">Simple. Private. Yours.</p>
          </div>

          <div className="p-8 sm:p-12 lg:p-14">
            <div className="mb-9">
              <Link
                href="/"
                className="text-sm font-semibold text-[#8b5e3c] lg:hidden"
              >
                ← Book Collection
              </Link>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#8b5e3c] lg:mt-0">
                Sign in
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back.
              </h2>

              <p className="mt-3 text-[#777066]">
                Enter your details to access your collection.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-[#25221e]/10 bg-[#f8f5ef] px-4 py-3.5 outline-none transition-all duration-300 placeholder:text-[#aaa196] focus:border-[#8b5e3c] focus:bg-white focus:ring-4 focus:ring-[#8b5e3c]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-2xl border border-[#25221e]/10 bg-[#f8f5ef] px-4 py-3.5 outline-none transition-all duration-300 placeholder:text-[#aaa196] focus:border-[#8b5e3c] focus:bg-white focus:ring-4 focus:ring-[#8b5e3c]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#25221e] px-4 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#8b5e3c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {message && (
              <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {message}
              </p>
            )}

            <p className="mt-7 text-center text-sm text-[#777066]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#8b5e3c] transition-colors duration-300 hover:text-[#25221e]"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
