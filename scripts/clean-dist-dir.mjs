import { rm } from "node:fs/promises";

export async function cleanDistDir(dir) {
  await rm(dir, {
    recursive: true,
    force: true,
    maxRetries: 6,
    retryDelay: 500,
  });
}
