import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganization } from "./current-organization";

export interface CurrentFund {
  id: string;
  name: string;
}

export async function getCurrentFund(): Promise<CurrentFund | null> {
  const organization = await getCurrentOrganization();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("funds")
    .select("id, name")
    .eq("organization_id", organization.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to resolve the active fund: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name ?? "Untitled fund",
  };
}
