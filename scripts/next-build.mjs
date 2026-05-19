import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";

const cwd = process.cwd();
const nextBin = join(cwd, "node_modules", "next", "dist", "bin", "next");
const buildDir = join(cwd, ".next");

await rm(buildDir, { recursive: true, force: true });

const child = spawn(process.execPath, [nextBin, "build", ...process.argv.slice(2)], {
  cwd,
  env: {
    ...process.env,
    NEXT_DIST_DIR: ".next",
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
