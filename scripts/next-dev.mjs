import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";

const cwd = process.cwd();
const nextBin = join(cwd, "node_modules", "next", "dist", "bin", "next");
const devDir = join(cwd, ".next-dev");

await rm(devDir, { recursive: true, force: true });

const child = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  cwd,
  env: {
    ...process.env,
    NEXT_DIST_DIR: ".next-dev",
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
