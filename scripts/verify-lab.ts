#!/usr/bin/env bun
/**
 * Lab Verification Script
 *
 * Verifies completion of Thread Engineering Labs.
 * Run after completing each lab to confirm success.
 *
 * Usage:
 *   bun run verify 1     # Verify Lab 1
 *   bun run verify 2     # Verify Lab 2
 *   bun run verify 6     # Verify Lab 6
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

type CheckResult = {
  passed: boolean;
  message: string;
};

type LabCheck = () => Promise<CheckResult[]>;

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Get the bun executable path (the one running this script)
const BUN = process.execPath;

function log(message: string, color = RESET): void {
  console.log(`${color}${message}${RESET}`);
}

function passed(message: string): CheckResult {
  return { passed: true, message };
}

function failed(message: string): CheckResult {
  return { passed: false, message };
}

/**
 * Lab 1: Base Thread - Null Check Bug Fix
 */
async function checkLab1(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const filePath = "src/routes/users.ts";

  // Check 1: File exists
  if (!existsSync(filePath)) {
    results.push(failed(`File ${filePath} not found`));
    return results;
  }
  results.push(passed(`File ${filePath} exists`));

  // Check 2: Null check in getUserPreferences function
  const content = readFileSync(filePath, "utf-8");

  // Extract the getUserPreferences function body
  const funcMatch = content.match(/function getUserPreferences[\s\S]*?^}/m);
  const funcBody = funcMatch?.[0] || "";

  // Look for proper null checks within getUserPreferences specifically
  // Note: user! is a non-null assertion (bug), not a null check
  // Valid patterns: if (!user), user === undefined, user?.preferences, etc.
  const hasProperCheck =
    /if\s*\(\s*!user\s*\)/.test(funcBody) ||
    funcBody.includes("user === undefined") ||
    funcBody.includes("user === null") ||
    /user\?\.\s*preferences/.test(funcBody) ||
    /if\s*\(\s*!user\.preferences\s*\)/.test(funcBody) ||
    funcBody.includes("user.preferences === undefined") ||
    /user\.preferences\?\.\s*\w+/.test(funcBody) ||
    /user\?\.\s*preferences\?\.\s*\w+/.test(funcBody) ||
    // Also accept returning early with defaults
    /return\s*\{[\s\S]*?user\?\.preferences\?\./.test(funcBody);

  if (!hasProperCheck) {
    results.push(failed("getUserPreferences missing null/undefined checks"));
  } else {
    results.push(passed("Null/undefined checks implemented in getUserPreferences"));
  }

  // Check 3: Tests pass
  try {
    execSync(`${BUN} test tests/routes/users.test.ts`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
    results.push(passed("User tests pass"));
  } catch {
    results.push(failed("User tests fail - bug may not be fixed"));
  }

  return results;
}

/**
 * Lab 2: Parallel Thread - Docs + Tests
 */
async function checkLab2(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Lane 1: Check docs/README.md is complete
  const readmePath = "docs/README.md";
  if (!existsSync(readmePath)) {
    results.push(failed(`File ${readmePath} not found`));
  } else {
    const readme = readFileSync(readmePath, "utf-8");
    const hasTodo = readme.includes("TODO:");

    if (hasTodo) {
      results.push(failed("docs/README.md still contains TODO placeholders"));
    } else {
      results.push(passed("docs/README.md has no TODO placeholders"));
    }

    // Check for actual content
    const hasSetupInstructions = readme.includes("bun install") || readme.includes("bun dev");
    if (!hasSetupInstructions) {
      results.push(failed("docs/README.md missing setup instructions"));
    } else {
      results.push(passed("docs/README.md has setup instructions"));
    }
  }

  // Lane 2: Check email tests exist and pass
  const emailTestPath = "tests/services/email.test.ts";
  if (!existsSync(emailTestPath)) {
    results.push(failed(`File ${emailTestPath} not found - create email service tests`));
  } else {
    results.push(passed(`File ${emailTestPath} exists`));

    try {
      execSync(`${BUN} test tests/services/email.test.ts`, {
        stdio: "pipe",
        encoding: "utf-8",
      });
      results.push(passed("Email service tests pass"));
    } catch {
      results.push(failed("Email service tests fail"));
    }
  }

  return results;
}

/**
 * Lab 3: Chained Thread - Token Expiration
 */
async function checkLab3(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const filePath = "src/middleware/auth.ts";

  // Check 1: File exists
  if (!existsSync(filePath)) {
    results.push(failed(`File ${filePath} not found`));
    return results;
  }
  results.push(passed(`File ${filePath} exists`));

  // Check 2: Expiration check implementation in authMiddleware
  const content = readFileSync(filePath, "utf-8");

  // Extract the authMiddleware function body
  const middlewareMatch = content.match(/function authMiddleware[\s\S]*?^}/m);
  const middlewareBody = middlewareMatch?.[0] || "";

  // Look for expiration checking logic WITHIN authMiddleware
  // Must be actual code, not comments (line must not start with //)
  // Remove single-line comments from the body for checking
  const codeOnlyBody = middlewareBody
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");

  const hasExpirationCallInMiddleware =
    /isTokenExpired\s*\(/.test(codeOnlyBody) ||
    /isExpired\s*\(/.test(codeOnlyBody) ||
    /checkExpiration\s*\(/.test(codeOnlyBody);

  // Or inline expiration logic within middleware (using code-only body)
  const hasInlineExpirationLogic =
    /decoded\.exp\s*[<>]=?\s*Date\.now\(\)/.test(codeOnlyBody) ||
    /decoded\.exp\s*\*\s*1000\s*[<>]=?\s*Date\.now\(\)/.test(codeOnlyBody) ||
    /Date\.now\(\)\s*[<>]=?\s*decoded\.exp/.test(codeOnlyBody);

  // Also check for the expiration function definition (anywhere in file, excluding comments)
  const codeOnlyContent = content
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");

  const hasExpirationFunction =
    /function\s+(isTokenExpired|isExpired|checkExpiration)\s*\(/.test(codeOnlyContent) ||
    /const\s+(isTokenExpired|isExpired|checkExpiration)\s*=\s*\(/.test(codeOnlyContent);

  // Check if there's a return with "expired" error in middleware (using code-only body)
  const hasExpiredErrorReturn = /return\s+c\.json\s*\(\s*\{[^}]*expired/i.test(codeOnlyBody);

  if (
    !hasExpirationCallInMiddleware &&
    !hasInlineExpirationLogic &&
    !hasExpiredErrorReturn &&
    !hasExpirationFunction
  ) {
    results.push(failed("No token expiration check found in authMiddleware"));
  } else {
    results.push(passed("Token expiration check implemented"));
  }

  // Check 3: Tests for expiration rejection
  const testPath = "tests/middleware/auth.test.ts";
  if (existsSync(testPath)) {
    const testContent = readFileSync(testPath, "utf-8");

    // Look for an uncommented test that tests expired token REJECTION
    // The test name should include "expired" and "reject" or similar
    // Must be an actual test (not commented out)
    const hasActiveExpiredRejectionTest =
      /^\s*it\s*\(\s*["'].*reject.*expir/im.test(testContent) ||
      /^\s*it\s*\(\s*["'].*expir.*reject/im.test(testContent) ||
      /^\s*it\s*\(\s*["']should reject expired/im.test(testContent) ||
      /^\s*it\s*\(\s*["']expired token.*401/im.test(testContent);

    if (hasActiveExpiredRejectionTest) {
      results.push(passed("Auth tests include expiration rejection test"));
    } else {
      results.push(failed("Auth tests missing expiration rejection test"));
    }
  }

  // Check 4: Tests pass
  try {
    execSync(`${BUN} test tests/middleware/auth.test.ts`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
    results.push(passed("Auth middleware tests pass"));
  } catch {
    results.push(failed("Auth middleware tests fail"));
  }

  return results;
}

/**
 * Lab 4: Fusion Thread - Architecture Decision
 */
async function checkLab4(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const filePath = "docs/architecture-decision.md";

  // Check 1: File exists
  if (!existsSync(filePath)) {
    results.push(failed(`File ${filePath} not found`));
    return results;
  }
  results.push(passed(`File ${filePath} exists`));

  const content = readFileSync(filePath, "utf-8");

  // Check 2: Decision section has content
  const decisionMatch = content.match(/## Decision\s*\n+([\s\S]*?)(?=\n## |$)/);
  const decisionContent = decisionMatch?.[1]?.trim() || "";

  if (
    decisionContent.length < 20 ||
    decisionContent.includes("[Use Lab 4") ||
    decisionContent.includes("[Your")
  ) {
    results.push(failed("Decision section is empty or contains placeholder text"));
  } else {
    results.push(passed("Decision section has content"));
  }

  // Check 3: Rationale section has content
  const rationaleMatch = content.match(/## Rationale\s*\n+([\s\S]*?)(?=\n## |$)/);
  const rationaleContent = rationaleMatch?.[1]?.trim() || "";

  if (
    rationaleContent.length < 50 ||
    rationaleContent.includes("[Document") ||
    rationaleContent.includes("[Your")
  ) {
    results.push(failed("Rationale section is empty or contains placeholder text"));
  } else {
    results.push(passed("Rationale section has content"));
  }

  // Check 4: Consequences section has content
  const consequencesMatch = content.match(/## Consequences\s*\n+([\s\S]*?)(?=\n## |$)/);
  const consequencesContent = consequencesMatch?.[1]?.trim() || "";

  if (
    consequencesContent.length < 30 ||
    consequencesContent.includes("[What are") ||
    consequencesContent.includes("[Your")
  ) {
    results.push(failed("Consequences section is empty or contains placeholder text"));
  } else {
    results.push(passed("Consequences section has content"));
  }

  return results;
}

/**
 * Lab 5: Meta Thread - Feature Decomposition
 *
 * Lab 5 is about PLANNING, not implementing. Students should create a thread map
 * document that decomposes the notification feature into executable child threads.
 */
async function checkLab5(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const threadMapPath = "docs/thread-map-notification-preferences.md";

  // Check 1: Thread map document exists
  if (!existsSync(threadMapPath)) {
    results.push(failed(`Thread map document not found at ${threadMapPath}`));
    results.push(
      failed("Hint: Lab 5 produces a planning document, not code. Create the thread map file.")
    );
    return results;
  }
  results.push(passed("Thread map document exists"));

  const content = readFileSync(threadMapPath, "utf-8");

  // Check 2: Has at least 4 threads (NP-1, NP-2, etc. or Thread 1, Thread 2, etc.)
  const npThreadMatches = content.match(/NP-\d/g) || [];
  const numberedThreadMatches = content.match(/###\s*(Thread\s+)?\d+[.:]/g) || [];
  const threadCount = Math.max(
    new Set(npThreadMatches).size,
    new Set(numberedThreadMatches).size
  );

  if (threadCount < 4) {
    results.push(failed(`Only ${threadCount} threads found (need at least 4)`));
  } else {
    results.push(passed(`${threadCount} threads defined`));
  }

  // Check 3: Each thread has Definition of Done (DoD)
  const hasDoD =
    content.toLowerCase().includes("definition of done") ||
    content.toLowerCase().includes("dod:") ||
    content.includes("**DoD:**") ||
    content.includes("- DoD:");

  if (!hasDoD) {
    results.push(failed("Missing Definition of Done (DoD) for threads"));
  } else {
    results.push(passed("Threads have Definition of Done"));
  }

  // Check 4: Dependencies documented
  const hasDependencies =
    content.toLowerCase().includes("dependencies") ||
    content.toLowerCase().includes("depends on") ||
    content.includes("**Dependencies:**");

  if (!hasDependencies) {
    results.push(failed("Dependencies not documented"));
  } else {
    results.push(passed("Dependencies documented"));
  }

  // Check 5: Execution order specified
  const hasExecutionOrder =
    content.toLowerCase().includes("execution order") ||
    content.toLowerCase().includes("recommended sequence") ||
    content.toLowerCase().includes("dependency graph") ||
    content.toLowerCase().includes("parallelization");

  if (!hasExecutionOrder) {
    results.push(failed("Execution order not specified"));
  } else {
    results.push(passed("Execution order specified"));
  }

  // Warning check: Make sure no implementation code was created
  const implementationFiles = [
    "src/services/dispatcher.ts",
    "src/services/preferences.ts",
    "src/routes/notifications.ts",
  ];

  const implementedFiles = implementationFiles.filter((f) => existsSync(f));
  if (implementedFiles.length > 0) {
    results.push(
      failed(
        `WARNING: Found implementation files (${implementedFiles.join(", ")}). Lab 5 is about PLANNING, not implementing. Consider resetting.`
      )
    );
  }

  return results;
}

/**
 * Lab 6: Long Thread - JSDoc Documentation
 */
async function checkLab6(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const utilFiles = ["src/utils/validators.ts", "src/utils/formatters.ts", "src/utils/parsers.ts"];

  for (const filePath of utilFiles) {
    if (!existsSync(filePath)) {
      results.push(failed(`File ${filePath} not found`));
      continue;
    }

    const content = readFileSync(filePath, "utf-8");
    const fileName = filePath.split("/").pop();

    // Count exported functions
    const exportMatches = content.match(/export function \w+/g) || [];
    const exportCount = exportMatches.length;

    // Count JSDoc comments (looking for /** ... */)
    const jsdocMatches = content.match(/\/\*\*[\s\S]*?\*\/\s*\nexport function/g) || [];
    const jsdocCount = jsdocMatches.length;

    if (jsdocCount < exportCount) {
      results.push(failed(`${fileName}: ${jsdocCount}/${exportCount} functions have JSDoc`));
    } else {
      results.push(passed(`${fileName}: All ${exportCount} functions have JSDoc`));
    }
  }

  // Check that lint passes on src/utils/ only (other files have intentional issues for other labs)
  try {
    execSync(`bunx biome check src/utils/`, { stdio: "pipe", encoding: "utf-8" });
    results.push(passed("Lint passes for src/utils/"));
  } catch {
    results.push(failed("Lint fails in src/utils/ - check for issues"));
  }

  return results;
}

// Lab check registry
const labChecks: Record<string, LabCheck> = {
  "1": checkLab1,
  "2": checkLab2,
  "3": checkLab3,
  "4": checkLab4,
  "5": checkLab5,
  "6": checkLab6,
};

const labNames: Record<string, string> = {
  "1": "Base Thread - Null Check Bug",
  "2": "Parallel Thread - Docs + Tests",
  "3": "Chained Thread - Token Expiration",
  "4": "Fusion Thread - Architecture Decision",
  "5": "Meta Thread - Feature Decomposition",
  "6": "Long Thread - JSDoc Documentation",
};

async function verifyLab(labNumber: string): Promise<boolean> {
  const check = labChecks[labNumber];
  const name = labNames[labNumber];

  if (!check || !name) {
    log(`Unknown lab: ${labNumber}`, RED);
    return false;
  }

  console.log("");
  log("═══════════════════════════════════════════════════════", YELLOW);
  log(`  Lab ${labNumber}: ${name}`, YELLOW);
  log("═══════════════════════════════════════════════════════", YELLOW);
  console.log("");

  const results = await check();
  let allPassed = true;

  for (const result of results) {
    if (result.passed) {
      log(`  ✅ ${result.message}`, GREEN);
    } else {
      log(`  ❌ ${result.message}`, RED);
      allPassed = false;
    }
  }

  console.log("");
  if (allPassed) {
    log("  Result: PASS ✨", GREEN);
  } else {
    log("  Result: FAIL", RED);
  }

  return allPassed;
}

// Main
const arg = process.argv[2];

if (!arg) {
  log("\nUsage: bun run verify <lab-number>", YELLOW);
  log("\nExamples:", RESET);
  log("  bun run verify 1      # Verify Lab 1", RESET);
  log("  bun run verify 2      # Verify Lab 2", RESET);
  log("  bun run verify 6      # Verify Lab 6", RESET);
  console.log("");
  log("Verify each lab individually after completing it.", RESET);
  console.log("");
  process.exit(1);
}

if (labChecks[arg]) {
  const passed = await verifyLab(arg);
  process.exit(passed ? 0 : 1);
} else {
  log(`Unknown lab: ${arg}`, RED);
  log("Valid options: 1, 2, 3, 4, 5, 6", RESET);
  process.exit(1);
}
