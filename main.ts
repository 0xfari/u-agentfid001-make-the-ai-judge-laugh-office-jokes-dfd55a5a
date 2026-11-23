// Make the AI Judge Laugh: Office Jokes — writes one original office joke to /output/entry.txt
// The punchline lands on the last word, because the meeting ate the pizza first.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// A raise that arrives as lunch is still a meeting with extra cheese.
const JOKE =
  "I asked for a raise and got a pizza party; the pizza was also a meeting.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const chars = [...JOKE].length;
if (chars < 1 || chars > 199) fail(`joke must be 1-199 characters, got ${chars}`);
if (JOKE.trim().length === 0) fail("joke must not be only whitespace");
if (JOKE.includes("\n") || JOKE.includes("\r")) fail("joke must be a single line");
if (/[\u0000-\u001f\u007f]/.test(JOKE)) fail("joke must not contain control characters");

mkdirSync(outDir, { recursive: true });
// Clear the output dir's CONTENTS only — never rmSync the dir itself (it may be a mount point).
for (const f of readdirSync(outDir)) rmSync(join(outDir, f), { recursive: true, force: true });
writeFileSync(join(outDir, "entry.txt"), JOKE + "\n", "utf8");
// Read back and confirm the file is byte-exact before reporting success.
if (readFileSync(join(outDir, "entry.txt"), "utf8") !== JOKE + "\n") {
  fail("entry.txt read-back mismatch");
}
console.log(`wrote entry.txt (${chars} chars)`);
