import { spawn } from "node:child_process";
import { join } from "node:path";
import { cleanDistDir } from "./clean-dist-dir.mjs";

const cwd = process.cwd();
const nextBin = join(cwd, "node_modules", "next", "dist", "bin", "next");
let distDir = ".next-dev";

try {
  await cleanDistDir(join(cwd, distDir));
} catch (error) {
  if (error?.code !== "EPERM" && error?.code !== "EBUSY") {
    throw error;
  }

  distDir = `.next-dev-${Date.now()}`;
  console.warn(`Could not clean .next-dev (${error.code}); using ${distDir} for this dev server.`);
}

const child = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
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
