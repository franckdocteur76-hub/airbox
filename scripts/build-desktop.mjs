/**
 * Prépare la version desktop portable :
 *   1. build Next.js en export statique (DESKTOP_BUILD=1) -> out/
 *   2. copie out/ dans desktop/renderer/ (embarqué par Electron)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");
const dest = path.join(root, "desktop", "renderer");

console.log("→ build statique Next.js (export)…");
execSync("npx next build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, DESKTOP_BUILD: "1" },
});

if (!fs.existsSync(outDir)) {
  console.error("✗ dossier out/ introuvable — l'export statique a échoué.");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(outDir, dest, { recursive: true });

const files = fs.readdirSync(dest);
console.log(`✓ renderer prêt (${files.length} entrées) -> ${dest}`);
