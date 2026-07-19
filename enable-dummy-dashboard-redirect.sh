#!/usr/bin/env bash
set -euo pipefail

echo "Creating backups..."

cp "app/(dashboard)/layout.tsx" "app/(dashboard)/layout.tsx.bak"
cp "app/login/page.tsx" "app/login/page.tsx.bak"

echo "Removing temporary Supabase authentication protection..."

cat > "app/(dashboard)/layout.tsx" <<'TSX'
import { DashboardShell } from "@/components/vc-brain-ui";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
TSX

echo "Updating dummy login redirect..."

python3 <<'PY'
from pathlib import Path
import re

path = Path("app/login/page.tsx")
text = path.read_text()

# Replace any existing router destination with /dashboard.
text = re.sub(
    r'router\.(?:replace|push)\(\s*["\'][^"\']+["\']\s*\)',
    'router.replace("/dashboard")',
    text,
    count=1,
)

# Ensure the form prevents its default GET submission.
if "event.preventDefault();" not in text:
    text = text.replace(
        "function handleSubmit(event: FormEvent<HTMLFormElement>) {",
        """function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();""",
        1,
    )

path.write_text(text)
print("Dummy login now redirects to /dashboard.")
PY

echo "Creating /dashboard redirect route..."

mkdir -p app/dashboard

cat > app/dashboard/page.tsx <<'TSX'
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/thesis-confirmation");
}
TSX

echo "Removing old Next.js cache..."
rm -rf .next

echo "Running checks..."
npm run lint
npm run build

echo
echo "Completed."
echo "Dummy login flow:"
echo "/login → /dashboard → /thesis-confirmation"
