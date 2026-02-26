#!/usr/bin/env bun
/**
 * Auto-generate src/index.ts dari direktori src/lib/components/ui/
 * Usage: bun run generate
 */

import { readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UI_DIR = join(__dirname, "../src/lib/components/ui");
const OUTPUT = join(__dirname, "../src/index.ts");

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

const components = readdirSync(UI_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const lines = [
  `// AUTO-GENERATED — jangan edit manual`,
  `// Jalankan: bun run generate`,
  `//`,
  `// Import pattern:`,
  `//   import { Button } from "@oxtro-ui/shadcn/button"   ← per-path (recommended)`,
  `//   import { Button } from "@oxtro-ui/shadcn"          ← dari barrel ini`,
  ``,
  ...components.map(
    (name) =>
      `export * as ${toPascalCase(name)} from "./lib/components/ui/${name}/index.js";`
  ),
];

writeFileSync(OUTPUT, lines.join("\n") + "\n");
console.log(`✓ Generated src/index.ts with ${components.length} components:`);
console.log(components.map((c) => `  - ${c}`).join("\n"));
