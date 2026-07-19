import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const requestedNext =
    request.nextUrl.searchParams.get("next") ?? "/thesis-confirmation";

  // Prevent redirecting to an external website.
  const next = requestedNext.startsWith("/")
    ? requestedNext
    : "/thesis-confirmation";

  if (!code) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "error",
      "The confirmation link is invalid or has expired.",
    );

    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", error.message);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, request.url));
}