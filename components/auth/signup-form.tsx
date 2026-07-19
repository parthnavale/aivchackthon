"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("name") ?? "").trim();

    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm") ?? "");

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage("Please complete all fields.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/thesis-confirmation`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    /*
     * If email confirmation is disabled, Supabase immediately returns
     * a session and the user can enter the dashboard.
     */
    if (data.session) {
      router.replace("/thesis-confirmation");
      router.refresh();
      return;
    }

    /*
     * If email confirmation is enabled, no session is created until
     * the user clicks the confirmation link.
     */
    form.reset();

    setSuccessMessage(
      "Account created. Check your email and click the confirmation link.",
    );

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={6}
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10"
        />
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Confirm password
        </label>

        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          minLength={6}
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10"
        />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-50/20"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}