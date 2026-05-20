import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const distStateFile = join(process.cwd(), ".next-dist-state.json");

export async function readDistState() {
  try {
    return JSON.parse(await readFile(distStateFile, "utf8"));
  } catch {
    return null;
  }
}

export async function writeDistState(distDir) {
  await writeFile(
    distStateFile,
    `${JSON.stringify({ distDir, updatedAt: new Date().toISOString() }, null, 2)}\n`
  );
}

export async function clearDistState() {
  await rm(distStateFile, { force: true });
}
