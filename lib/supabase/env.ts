export function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      );
    }

    throw new Error("Supabase environment variables are missing.");
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  };
}
