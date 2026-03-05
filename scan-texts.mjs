import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "src");
const exts = new Set([".ts", ".tsx"]);

const IGNORE_DIRS = new Set(["node_modules", "dist", "build", ".next", "coverage"]);
const IGNORE_FILES = new Set(["text.ts", "text_en.ts", "text_es.ts"]);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(path.join(dir, entry.name), acc);
    } else {
      const ext = path.extname(entry.name);
      if (exts.has(ext) && !IGNORE_FILES.has(entry.name)) {
        acc.push(path.join(dir, entry.name));
      }
    }
  }
  return acc;
}

// Finds strings "..." or '...'
const STR_RE = /(["'])(?:(?!\1|\\).|\\.){3,}\1/g;

function isProbablyNotText(str) {
  const s = str.slice(1, -1);

  // ignore common non‑UI strings
  if (s.startsWith("bg-") || s.startsWith("text-") || s.startsWith("border-")) return true;
  if (s.includes("/") || s.includes("./") || s.includes("../")) return true;
  if (s.includes("http://") || s.includes("https://")) return true;
  if (/^[A-Z0-9_/-]+$/.test(s)) return true;
  if (/^[a-zA-Z0-9_-]{1,2}$/.test(s)) return true;
  if (s.includes("@/") || s.includes("react") || s.includes("vite")) return true;

  // ignore likely tailwind classes
  if (s.includes(" ") && s.split(" ").length > 6) return true;

  return false;
}

const files = walk(ROOT);
const results = [];

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\s*(import|export)\b/.test(line)) continue;
    if (line.includes("className=")) continue;

    const matches = line.match(STR_RE);
    if (!matches) continue;

    for (const m of matches) {
      if (isProbablyNotText(m)) continue;

      results.push({
        file: path.relative(process.cwd(), file),
        line: i + 1,
        text: m,
      });
    }
  }
}

const byFile = results.reduce((acc, r) => {
  acc[r.file] ||= [];
  acc[r.file].push(r);
  return acc;
}, {});

console.log("\n=== Hardcoded text candidates ===\n");
for (const file of Object.keys(byFile).sort()) {
  console.log(file);
  for (const r of byFile[file]) {
    console.log(`  L${r.line}: ${r.text}`);
  }
  console.log("");
}

console.log(`Total hits: ${results.length}\n`);
