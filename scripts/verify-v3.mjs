import { spawn } from "node:child_process";
import { REPO_ROOT } from "./runtime-harness.mjs";

const steps = [
  ["scripts/validate-skills.mjs"],
  ["scripts/test-runtime.mjs"],
  ["scripts/geometry-gate.mjs", "--variant", "baseline_faithful", "--allow-fail"],
  ["scripts/geometry-gate.mjs", "--variant", "enhanced_immersive"],
  ["scripts/capture-evidence.mjs"],
  ["scripts/build-manifest.mjs"],
  ["scripts/build-audit.mjs"],
  ["scripts/validate-contracts.mjs"],
  ["scripts/validate-artifacts.mjs"]
];

for (const argumentsList of steps) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, argumentsList, { cwd: REPO_ROOT, stdio: "inherit", env: process.env });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${argumentsList.join(" ")} failed with ${signal || `exit ${code}`}`));
    });
  });
}

process.stdout.write("verify-v3: PASS · contracts, runtime, geometry, evidence, audit and hashes are coherent\n");
