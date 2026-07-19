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
   <LoginForm/>);

}