import { DashboardShell } from "@/components/vc-brain-ui";
import { requireUser } from "@/lib/auth/require-user";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser();

  return <DashboardShell>{children}</DashboardShell>;
}