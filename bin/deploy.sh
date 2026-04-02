#!/bin/bash
set -e

VAULT_DIR="$HOME/.obsidian/local_notes"
PLUGIN_DIR="$VAULT_DIR/.obsidian/plugins/obsidian-calculators"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building..."
cd "$REPO_DIR"
npm run build

echo "Deploying to $PLUGIN_DIR..."
mkdir -p "$PLUGIN_DIR"
cp main.js manifest.json styles.css "$PLUGIN_DIR/"

echo "Done. Reload the plugin in Obsidian to pick up changes."
