// Copies the canonical nutrition dataset from the repo-root data/ directory
// into public/data/ so the app can fetch it as a static asset. The repo-root
// file (derived from reference/2026sep15_cookout_nutrition.pdf) stays the
// single source of truth; this script never writes back to it.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(appRoot);

const source = join(repoRoot, "data", "cookout_nutrition.json");
const destDir = join(appRoot, "public", "data");
const dest = join(destDir, "cookout_nutrition.json");

if (!existsSync(source)) {
  console.error(`sync-data: source file not found at ${source}`);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(source, dest);
console.log(`sync-data: copied ${source} -> ${dest}`);
