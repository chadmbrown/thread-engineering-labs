# Lab 6: Long Thread

**Time:** 30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Lab 1 (Base Thread)

---

## What is a Long Thread?

A Long Thread is a bounded autonomous session for mechanical, repetitive work. Instead of doing 50 similar tasks manually, you give Claude clear instructions and let it grind through the work while you do something else.

Think of it as delegation for grunt work: adding types to 100 functions, fixing lint errors across a codebase, updating imports after a rename. Work that's tedious but doesn't require creativity.

---

## Why Long Threads Matter

**The problem with mechanical work:**
- It's boring (humans get sloppy)
- It's repetitive (context switching between files)
- It takes forever (even "quick" changes add up)
- Quality degrades as you tire

**What Long Threads give you:**
- Consistent quality across all files
- Progress updates while you work on other things
- Freedom to focus on interesting problems
- Time back for creative work

Long Threads turn Claude into a tireless junior developer for grunt work.

---

## When to Use a Long Thread

✅ **Good fit:**
- Adding JSDoc comments to functions
- Adding TypeScript types to a JS codebase
- Fixing lint errors (consistent patterns)
- Updating imports after a module rename
- Adding error handling to API routes
- Standardizing code patterns

❌ **Not a good fit:**
- Complex logic changes → **Base Thread**
- Risky changes → **Chained Thread**
- Work requiring decisions → **Fusion Thread**
- Tasks that need human judgment on each file

**Rule of thumb:** If you could write instructions for an intern to follow mechanically, it's a Long Thread.

---

## The Lab 6 Task

All functions in `src/utils/` are missing JSDoc comments. There are 12-15 functions across three files:

- `src/utils/validators.ts`
- `src/utils/formatters.ts`
- `src/utils/parsers.ts`

Your task: Run a Long Thread to add JSDoc to all of them.

---

## Critical Safety Rules

Long Threads give Claude more autonomy. This requires safety guardrails:

| Rule | Why |
|------|-----|
| **Bound the work** | Explicit file list, no scope creep |
| **Progress updates** | Know where Claude is, catch issues early |
| **Stop conditions** | Define when to halt (errors, confusion) |
| **Sandbox branch** | Easy rollback if something goes wrong |
| **Review before merge** | Human eyes on the final result |

Never run Long Threads with `--dangerously-skip-permissions` on production code.

---

## Setup

### 1. Create a sandbox branch

```bash
git checkout -b thread/long/lab-6-add-jsdoc
```

### 2. Review the files to be modified

```bash
cat src/utils/validators.ts
cat src/utils/formatters.ts
cat src/utils/parsers.ts
```

Count the functions. Know what you're working with.

### 3. Start Claude Code

```bash
claude
```

### 4. Verify permissions (optional)

Type `/permissions` directly in Claude Code (this is a slash command you type, not a prompt for Claude). Verify `Edit` is allowed. If not, Claude will prompt you when needed — you can skip this step.

---

## The Prompt

```
I need you to run a long, mechanical task. Follow these rules carefully.

## Task
Add JSDoc comments to all exported functions in `src/utils/`. 

## Scope (ONLY these files)
- `src/utils/validators.ts`
- `src/utils/formatters.ts`
- `src/utils/parsers.ts`

Do NOT modify any other files.

## JSDoc Format
For each function, add a JSDoc comment with:
- Brief description (one line)
- @param for each parameter (with type and description)
- @returns description (with type)
- @example with a realistic usage example

Example:
```typescript
/**
 * Validates an email address format.
 * @param email - The email address to validate
 * @returns True if the email format is valid, false otherwise
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 */
export function isValidEmail(email: string): boolean {
```

## Process
1. Process ONE file at a time, in order: validators → formatters → parsers
2. For each file:
   a. Read the file
   b. Add JSDoc to each exported function
   c. Run `bun run lint` to verify no errors
   d. Report: "[filename]: Added JSDoc to N functions. Lint: pass/fail"
3. After all files, run `bun run typecheck` and report

## Progress Updates
After every file, report:
- File completed
- Number of functions documented
- Any issues encountered
- Lint status

## Stop Conditions
STOP and ask me if:
- A function's purpose is unclear
- You encounter an error you can't fix
- A file has more than 10 functions (confirm before proceeding)
- Lint fails after 2 fix attempts

## Quality Checks
- Every exported function must have JSDoc
- No lint errors when done
- Examples must be realistic (not placeholder)

Begin with `src/utils/validators.ts`.
```

---

## Walkthrough

### Step 1: Claude processes first file

> **Processing: `src/utils/validators.ts`**
>
> Reading file... Found 4 exported functions:
> - `isValidEmail`
> - `isValidPassword`
> - `isValidUsername`
> - `isValidUrl`
>
> Adding JSDoc to each...
>
> Running `bun run lint`... ✓ No errors
>
> **validators.ts: Added JSDoc to 4 functions. Lint: pass**
>
> Proceeding to `src/utils/formatters.ts`...

### Step 2: Claude processes second file

> **Processing: `src/utils/formatters.ts`**
>
> Reading file... Found 5 exported functions:
> - `formatCurrency`
> - `formatDate`
> - `formatPhoneNumber`
> - `truncateText`
> - `slugify`
>
> Adding JSDoc to each...
>
> Running `bun run lint`... ✓ No errors
>
> **formatters.ts: Added JSDoc to 5 functions. Lint: pass**
>
> Proceeding to `src/utils/parsers.ts`...

### Step 3: Claude processes third file

> **Processing: `src/utils/parsers.ts`**
>
> Reading file... Found 4 exported functions:
> - `parseQueryString`
> - `parseJson`
> - `parseBoolean`
> - `parseNumber`
>
> Adding JSDoc to each...
>
> Running `bun run lint`... ✓ No errors
>
> **parsers.ts: Added JSDoc to 4 functions. Lint: pass**

### Step 4: Final verification

> **All files processed. Running final checks...**
>
> `bun run typecheck`: ✓ No errors
> `bun run lint`: ✓ No errors
>
> **Summary:**
> - validators.ts: 4 functions documented
> - formatters.ts: 5 functions documented
> - parsers.ts: 4 functions documented
> - Total: 13 functions
> - All quality checks pass
>
> Ready for your review.

### Step 5: Review and merge

Review the changes:
```bash
git diff src/utils/
```

If satisfied:
```bash
git add src/utils/
git commit -m "docs: add JSDoc to all utility functions"
```

---

## Verify Your Lab Completion

```bash
bun run verify 6
```

Expected output:
```
Checking Lab 6: Long Thread...
✅ All functions in validators.ts have JSDoc
✅ All functions in formatters.ts have JSDoc
✅ All functions in parsers.ts have JSDoc
✅ Lint passes
✅ No files modified outside src/utils/

Result: PASS
```

---

## Training Complete!

You've now learned all 6 thread types:

| Thread | Use For |
|--------|---------|
| **Base** | Single focused task |
| **Parallel** | Independent tasks simultaneously |
| **Chained** | Risky work with checkpoints |
| **Fusion** | Multiple perspectives → decision |
| **Meta** | Decompose large work |
| **Long** | Mechanical grunt work |

### Next Steps

1. **Practice:** Use these patterns on real work for a week
2. **Customize:** Create slash commands for your most common patterns
3. **Share:** Teach teammates the patterns that helped you most
4. **Contribute:** Found an issue or improvement? Open a GitHub issue or PR

### One More Lab

You've learned the patterns. Now automate them.

**[Lab 7: Automated Fusion](lab-7-automated-fusion.md)** — Build a `/fusion` skill that turns 15-minute multi-perspective analysis into a 30-second command. This is where it all comes together.

---

## Certification

Run the full verification suite:

```bash
bun run verify all
```

If all 6 labs pass, you've completed Thread-Based Engineering training.

Share your completion in the GitHub Discussions!

---

## Reference (Optional)

The sections below are for troubleshooting, deeper learning, and advanced variations.

---

## Success Criteria

Your Long Thread succeeded if:

- [ ] All functions in `src/utils/` have JSDoc
- [ ] JSDoc includes description, @param, @returns, @example
- [ ] No lint errors
- [ ] No files outside scope were modified
- [ ] Progress updates kept you informed
- [ ] Completed in one session without major issues

---

## Failure Patterns

### "Claude modified files outside the scope"

**Why:** Instructions weren't explicit enough.

**Fix:** Be explicit: "ONLY modify files in `src/utils/`. Do NOT touch any other files."

### "Claude stopped asking questions on every function"

**Why:** Stop conditions weren't well-defined, or task was too ambiguous.

**Fix:** For JSDoc, most functions are clear. If truly unclear, Claude should stop. Make stop conditions explicit.

### "Quality was inconsistent across files"

**Why:** No examples in the prompt.

**Fix:** Always provide a concrete example in the prompt. "Format exactly like this: [example]"

### "Claude ran for 30 minutes and I had no idea what was happening"

**Why:** Progress updates weren't frequent enough.

**Fix:** Request updates after each file, or every N functions.

---

## Variations

### Ralph Wiggum Pattern (Hands-Off)

For very mechanical work with high confidence:

```bash
claude --dangerously-skip-permissions  # ONLY in sandbox/container
```

Let Claude run completely autonomously. Review everything before merging.

**Warning:** Only use in isolated environments. Never on production code.

### Batched Long Thread

For very large codebases:

```
Process files in batches of 10. After each batch:
1. Stop and summarize
2. Wait for my "continue" before next batch
```

This gives you review points without stopping after every file.

### Daily Long Thread

For ongoing maintenance:

```
Each day, find 5 functions missing JSDoc and add them. Report what you documented.
```

Incremental improvement over time.

---

## Retrospective Questions

- Did the progress updates give you enough visibility?
- Were the stop conditions appropriate?
- How did the quality compare to doing it manually?
- What other mechanical tasks could you Long Thread?

---

*Long Threads delegate grunt work. Your time is for creative problems.*
