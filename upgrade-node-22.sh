#!/usr/bin/env bash
set -euo pipefail

echo "Checking for nvm..."

if ! command -v nvm >/dev/null 2>&1; then
  if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "$HOME/.nvm/nvm.sh"
  else
    echo "nvm is not installed."
    echo "Install it first, then rerun this script."
    exit 1
  fi
fi

echo "Installing Node.js 22..."
nvm install 22
nvm use 22
nvm alias default 22

echo "Current versions:"
node -v
npm -v

echo "Adding Node.js engine to package.json..."

python3 <<'PY'
import json
from pathlib import Path

path = Path("package.json")
data = json.loads(path.read_text())

data["engines"] = {
    "node": "22.x"
}

path.write_text(json.dumps(data, indent=2) + "\n")
print("Updated package.json with Node.js 22 engine.")
PY

echo "Cleaning old build and dependencies..."
rm -rf node_modules .next

echo "Installing dependencies..."
npm ci

echo "Running lint..."
npm run lint

echo "Running production build..."
npm run build

echo
echo "Node.js 22 upgrade completed successfully."
