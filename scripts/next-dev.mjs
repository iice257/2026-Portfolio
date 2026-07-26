import { spawn } from "node:child_process";
import { join } from "node:path";
import { cleanDistDir } from "./clean-dist-dir.mjs";

const cwd = process.cwd();
const nextBin = join(cwd, "node_modules", "next", "dist", "bin", "next");
let distDir = `.next-dev-${process.pid}`;
const useLocalCompatibility = !process.env.CI && !process.env.VERCEL;

try {
  await cleanDistDir(join(cwd, distDir));
} catch (error) {
  if (error?.code !== "EPERM" && error?.code !== "EBUSY") {
    throw error;
  }

  distDir = `.next-dev-${process.pid}-${Date.now()}`;
  console.warn(`Could not clean the dev build directory (${error.code}); using ${distDir}.`);
}

const child = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  cwd,
  env: {
    ...process.env,
    NEXT_DIST_DIR: distDir,
    ...(useLocalCompatibility ? { NEXT_LOCAL_BUILD_COMPAT: "1" } : {}),
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
