import { spawn } from "node:child_process";
import { join } from "node:path";
import { cleanDistDir } from "./clean-dist-dir.mjs";
import { clearDistState, writeDistState } from "./dist-state.mjs";

const cwd = process.cwd();
const nextBin = join(cwd, "node_modules", "next", "dist", "bin", "next");
let distDir = ".next";
const useLocalCompatibility = !process.env.CI && !process.env.VERCEL;

try {
  await cleanDistDir(join(cwd, distDir));
  await clearDistState();
} catch (error) {
  if (error?.code !== "EPERM" && error?.code !== "EBUSY") {
    throw error;
  }

  distDir = `.next-build-${Date.now()}`;
  console.warn(`Could not clean .next (${error.code}); using ${distDir} for this build.`);
}

const child = spawn(process.execPath, [nextBin, "build", ...process.argv.slice(2)], {
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

  const exitCode = code ?? 0;
  if (exitCode === 0) {
    writeDistState(distDir)
      .catch((error) => {
        console.warn(`Could not write build dist state: ${error.message}`);
      })
      .finally(() => process.exit(exitCode));
    return;
  }

  process.exit(exitCode);
});
