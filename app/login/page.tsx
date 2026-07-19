import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import  {LoginForm}  from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default function LoginPage() {
  async function dummyLogin(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return;
    }

    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 via-white to-zinc-100 px-4 py-12 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      <section className="w-full max-w-md rounded-3xl border border-zinc-200/70 bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950 dark:shadow-black/20">

        
      <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Welcome back
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Log in to your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Enter your email and password to continue.
          </p>
        </div>

   <LoginForm/>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-zinc-950 hover:underline dark:text-zinc-50"
            >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}