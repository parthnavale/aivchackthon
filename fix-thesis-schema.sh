#!/usr/bin/env bash
set -euo pipefail

FILES=(
  "lib/data/theses.ts"
  "lib/mappers/thesis-mapper.ts"
)

for file in "${FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing file: $file"
    exit 1
  fi

  cp "$file" "$file.bak"
done

python3 <<'PY'
from pathlib import Path

data_file = Path("lib/data/theses.ts")
text = data_file.read_text()

replacements = {
    "id, title, sectors, stages, geographies, founder_patterns, dealbreakers, style_anchors, updated_at, current":
    "id, name, sectors, stages, geographies, founder_patterns, dealbreakers, style_anchors, updated_at, is_active",

    "title: input.title,":
    "name: input.title,",

    ".update({ current: true, updated_at: new Date().toISOString() })":
    """.update({
      is_active: true,
      updated_at: new Date().toISOString(),
    })""",
}

for old, new in replacements.items():
    if old not in text:
        print(f"Warning: exact text not found in lib/data/theses.ts:\n{old}\n")
    text = text.replace(old, new)

data_file.write_text(text)

mapper_file = Path("lib/mappers/thesis-mapper.ts")
mapper = mapper_file.read_text()

mapper = mapper.replace("title: string | null;", "name: string | null;")
mapper = mapper.replace("current: boolean | null;", "is_active: boolean | null;")
mapper = mapper.replace("title: row.title", "title: row.name")
mapper = mapper.replace("current: row.current", "current: row.is_active")
mapper = mapper.replace("row.title", "row.name")
mapper = mapper.replace("row.current", "row.is_active")

mapper_file.write_text(mapper)

print("Schema-name replacements completed.")
PY

echo
echo "Remaining references:"
grep -RInE '\btitle\b|\bcurrent\b' \
  lib/data/theses.ts \
  lib/mappers/thesis-mapper.ts || true

echo
echo "Running checks..."
npm run lint
npm run build
