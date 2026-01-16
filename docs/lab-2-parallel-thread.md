# Lab 2: Parallel Thread

**Time:** 30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Lab 1 (Base Thread)

---

## What is a Parallel Thread?

A Parallel Thread runs multiple Base Threads simultaneously on independent work. Instead of doing tasks sequentially, you spin up 2-5 Claude sessions working on different parts of your codebase at the same time.

Boris Cherny runs 5 local Claude sessions plus 5-10 web sessions in parallel. You don't need to go that far — even 2 parallel lanes will dramatically increase throughput.

---

## Why Parallel Threads Matter

**Sequential work:**
- Task A: 20 min → Task B: 20 min = **40 minutes**

**Parallel work:**
- Tasks A + B simultaneously = **~25 minutes** (longest task + merge time)

The key insight: Many tasks don't depend on each other. Documentation doesn't need to wait for tests. Parallelize independent work.

---

## When to Use Parallel Threads

✅ **Good fit:**
- Documentation + tests for different modules
- Multiple independent bug fixes
- Adding tests to unrelated files
- Code cleanup in separate directories
- Any 2+ tasks that don't touch the same files

❌ **Not a good fit:**
- Tasks that modify the same files → merge conflicts
- Sequential dependencies (B needs A's output) → use **Chained Thread**
- Risky changes → use **Chained Thread** for safety
- One complex task → stay with **Base Thread**

**The golden rule:** If two tasks touch the same files, don't parallelize them.

---

## The Lab 2 Issues

There are two independent issues in this codebase:

### Lane 1: Incomplete Documentation
**File:** `docs/README.md`

The setup documentation is incomplete — just TODOs. It needs real instructions.

### Lane 2: Missing Tests
**File:** `src/services/email.ts`

The email service has working code but NO tests. You'll create `tests/services/email.test.ts`.

These files don't overlap — perfect for parallel work.

---

## Setup Options

You need isolated environments so parallel Claude sessions don't conflict.

### Option A: Git Worktrees (Recommended for 2-4 lanes)

Worktrees let you check out multiple branches from the same repo without copying everything.

```bash
# From your main repo directory
git worktree add ../lane-1-docs -b thread/parallel/lab-2-docs
git worktree add ../lane-2-tests -b thread/parallel/lab-2-email-tests
```

This creates:
- `../lane-1-docs/` — full working copy for documentation
- `../lane-2-tests/` — full working copy for tests

**Pros:** Fast setup, shared Git objects, less disk space  
**Cons:** Can have issues with 5+ worktrees

### Option B: Full Clones (Boris's preference for 5+ lanes)

```bash
cd ..
git clone thread-engineering-labs lane-1-docs
cd lane-1-docs && git checkout -b thread/parallel/lab-2-docs
cd ..
git clone thread-engineering-labs lane-2-tests  
cd lane-2-tests && git checkout -b thread/parallel/lab-2-email-tests
```

**Pros:** Complete isolation, scales well  
**Cons:** More disk space, slower setup

For this lab, use **Option A (worktrees)**.

---

## Setup

### 1. Create worktrees

```bash
# From thread-engineering-labs directory
git worktree add ../lane-1-docs -b thread/parallel/lab-2-docs
git worktree add ../lane-2-tests -b thread/parallel/lab-2-email-tests
```

### 2. Open two terminals and navigate to each worktree

**Terminal 1 (Lane 1 - Docs):**
```bash
cd ../lane-1-docs
```

**Terminal 2 (Lane 2 - Tests):**
```bash
cd ../lane-2-tests
```

**Verify you're in the right place** — your terminal prompt should show the new directory:
```
~/projects/lane-1-docs %     # Terminal 1
~/projects/lane-2-tests %    # Terminal 2
```

If your prompt still shows `thread-engineering-labs`, the `cd` didn't work. Try again without copying any backticks or quotes from the docs.

**Tip:** Name your terminal tabs "Lane 1 - Docs" and "Lane 2 - Tests" to avoid confusion.

### 3. Start Claude in each

```bash
# In Terminal 1 (lane-1-docs)
claude

# In Terminal 2 (lane-2-tests)
claude
```

---

## The Prompts

### Lane 1 Prompt: Documentation

Paste this in Terminal 1:

```
I need you to complete a focused task in this lane of parallel work.

## Scope Restriction
You may ONLY modify: `docs/README.md`
Do NOT touch any files in `src/`, `tests/`, or any other location.
If the task seems to require changes elsewhere, STOP and tell me.

## Task
Improve the `docs/README.md` file. Currently it has TODO placeholders. Replace them with real content:

1. **Setup section**: How to clone, install (`bun install`), and run (`bun run dev`)
2. **Usage section**: Available scripts (`bun test`, `bun run lint`, `bun run verify <n>`)
3. **Project Structure**: Brief overview of src/, tests/, docs/ directories

Keep it concise — this is a training repo, not production documentation.

## Process
1. **Plan**: Read the current `docs/README.md`. List what sections need content.
2. **Implement**: Write the documentation.
3. **Verify**: Run `bun run lint` to check markdown formatting.
4. **Summarize**: What you added, any concerns.

Stop after summary for my review.
```

### Lane 2 Prompt: Tests

Paste this in Terminal 2:

```
I need you to complete a focused task in this lane of parallel work.

## Scope Restriction
You may ONLY modify/create files in: `tests/services/`
You may READ `src/services/email.ts` but NOT modify it.
Do NOT touch `docs/`, `src/`, or any other location.

## Task
Create tests for `src/services/email.ts`. The file has two functions:
- `sendEmail(to, subject, body)` 
- `sendTemplatedEmail(to, template, variables)`

Create `tests/services/email.test.ts` with tests for:
- Valid email sends (returns true)
- Missing recipient (returns false)
- Missing subject (returns false)
- Template variable substitution works correctly
- Empty template handling

## Process
1. **Plan**: Read `src/services/email.ts`. List the test cases you'll write.
2. **Implement**: Create the test file with all test cases.
3. **Verify**: Run `bun test tests/services/email.test.ts`. All tests must pass.
4. **Summarize**: Test count, what's covered, any edge cases not tested.

Stop after summary for my review.
```

---

## Walkthrough

### Step 1: Paste prompts simultaneously

Both Claude sessions start working. They'll produce plans for review.

### Step 2: Review plans in each lane

**Lane 1** should show a plan like:
> I'll add three sections: Setup with bun commands, Usage with available scripts, and Project Structure overview.

**Lane 2** should show a plan like:
> I'll create 5 test cases covering valid sends, missing params, and template substitution.

### Step 3: Approve and let them implement

If the plans look reasonable, tell each Claude to proceed. Just type:

```
Proceed
```

Or be more specific: "Looks good, implement it."

**Tip:** You can switch to auto-accept mode (`Shift+Tab`) to let Claude make file changes without prompting for each one.

Lane 1 will finish faster (just writing markdown). Lane 2 takes longer (writing and running tests).

### Step 4: Review completions

Each lane will finish with a summary like "Ready for your review." Check that:

**Lane 1 (Docs):**
- README has real content (not TODOs)
- Lint passed

**Lane 2 (Tests):**
- Test file was created
- Tests pass

### Step 5: Tell Claude to commit in each lane

In **each terminal**, tell Claude to commit the changes:

```
Commit with message "docs: add setup instructions to README"
```

```
Commit with message "test: add email service tests"
```

Wait for both commits to complete before proceeding.

### Step 6: Merge both branches

You have three options for running the merge commands:

1. **Use a separate terminal** (simplest) — leave Claude running in the worktree terminals
2. **Exit Claude first** — type `/exit` in a worktree terminal, then use it
3. **Ask Claude to do it** — tell Claude in either lane to run the merge commands

Using a separate terminal is easiest. Navigate to your original repo:

```bash
cd ../thread-engineering-labs
git checkout main
```

Verify you're in the right place (prompt should show `thread-engineering-labs`), then merge:

```bash
git merge thread/parallel/lab-2-docs
git merge thread/parallel/lab-2-email-tests
```

**Note:** Git may open a text editor (vim) for the merge commit message. To accept the default message and continue: press `Esc`, type `:wq`, press `Enter`.

No conflicts should occur since the lanes modified different files.

### Step 7: Cleanup worktrees

Still in your main repo directory:

```bash
git worktree remove ../lane-1-docs
git worktree remove ../lane-2-tests
```

---

## Verify Your Lab Completion

```bash
bun run verify 2
```

Expected output:
```
Checking Lab 2: Parallel Thread...
✅ docs/README.md has setup instructions (not just TODOs)
✅ tests/services/email.test.ts exists
✅ Email tests pass
✅ No merge conflicts occurred

Result: PASS
```

---

## Next Lab

Continue to **[Lab 3: Chained Thread](lab-3-chained-thread.md)** to learn how to handle risky, multi-phase work with checkpoints.

---

## Reference (Optional)

The sections below are for troubleshooting, deeper learning, and advanced variations. Skip if you're ready for Lab 3.

---

## Success Criteria

Your Parallel Thread succeeded if:

- [ ] Both lanes completed independently
- [ ] No merge conflicts when combining
- [ ] `docs/README.md` has real content (no TODOs)
- [ ] `tests/services/email.test.ts` exists and passes
- [ ] Total time < 30 minutes
- [ ] Each lane stayed within its file scope

---

## Failure Patterns

### "Merge conflict between lanes"

**Why:** Lanes modified the same file.

**Fix:** You probably modified something outside your scope. Check `git diff` for each branch before merging.

### "Lost track of which terminal was which"

**Why:** No naming system.

**Fix:** Always name terminal tabs. Use iTerm2 notifications to know when a session needs input.

### "One lane went off-scope"

**Why:** Claude tried to be "helpful."

**Fix:** The scope restriction in the prompt should prevent this. If Claude mentions touching other files, interrupt (`Escape`) immediately.

### "Lane 2 tests are failing"

**Why:** Tests don't match the actual email service implementation.

**Fix:** Have Claude re-read `src/services/email.ts` carefully. The tests must match what the functions actually do.

---

## Variations

### More Than 2 Lanes

Same pattern, more worktrees:

```bash
git worktree add ../lane-3 -b thread/parallel/feature-c
```

### Web Sessions as Additional Lanes

Inside Claude Code:
```
& Update docs/README.md with setup instructions. Only modify docs/README.md.
```

Monitor with `/tasks`. Bring back with `/teleport`.

### Parallel Bug Fixes

If you have 3 unrelated bugs in different files, create 3 lanes and fix them all simultaneously.

---

## Retrospective Questions

- Did scoping prevent conflicts, or did you hit issues?
- How much time did you save vs. sequential?
- Was coordinating two sessions harder than expected?
- What tasks would you parallelize next?

---

*Parallelization multiplies throughput. Scoping prevents chaos.*
