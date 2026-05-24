import { rm } from "node:fs/promises";
import { join } from "node:path";

const nextDir = join(process.cwd(), ".next-dev");

try {
  await rm(nextDir, { recursive: true, force: true });
} catch (error) {
  console.warn(`Could not clean .next-dev before dev: ${error.message}`);
}
