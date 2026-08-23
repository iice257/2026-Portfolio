import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const prefix = ".next-dev-";

let entries = [];
try {
  entries = await readdir(root, { withFileTypes: true });
} catch (error) {
  console.warn(`Could not list project root before cleaning dev dirs: ${error.message}`);
}

const removed = [];
for (const entry of entries) {
  if (!entry.isDirectory() || !entry.name.startsWith(prefix)) continue;
  try {
    await rm(join(root, entry.name), { recursive: true, force: true });
    removed.push(entry.name);
  } catch (error) {
    console.warn(`Could not remove ${entry.name}: ${error.message}`);
  }
}

if (removed.length > 0) {
  console.log(`Cleaned ${removed.length} stale dev build dir(s): ${removed.join(", ")}`);
} else {
  console.log("No stale dev build dirs found.");
}
