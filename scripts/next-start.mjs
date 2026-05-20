import { spawn } from "node:child_process";
import { join } from "node:path";
import { readDistState } from "./dist-state.mjs";

const cwd = process.cwd();
const nextBin = join(cwd, "node_modules", "next", "dist", "bin", "next");
const state = await readDistState();
const distDir = process.env.NEXT_DIST_DIR || state?.distDir || ".next";

const child = spawn(process.execPath, [nextBin, "start", ...process.argv.slice(2)], {
  cwd,
  env: {
    ...process.env,
    NEXT_DIST_DIR: distDir,
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
