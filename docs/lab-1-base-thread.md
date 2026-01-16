# Lab 1: Base Thread

**Time:** 30 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Lab 0 (environment setup complete)

---

## What is a Base Thread?

A Base Thread is the simplest thread type: one task, one Claude session, one outcome. It's the foundation for all other thread types.

Think of it as the atomic unit of AI-assisted work. Every other thread type either runs multiple Base Threads (Parallel), chains them (Chained), or decomposes into them (Meta).

---

## Why Base Threads Matter

**The problem with unstructured Claude sessions:**
- No clear goal → Claude wanders
- No verification step → bugs slip through
- No defined exit → session drags on
- Hard to know if you succeeded

**What a Base Thread gives you:**
- Clear scope (one task)
- Forced planning (Claude thinks before coding)
- Built-in verification (tests run before done)
- Clean exit (PR with summary)

Most developers skip straight to "help me code this" and wonder why results are inconsistent. The Base Thread pattern fixes this by adding structure without adding complexity.

---

## When to Use a Base Thread

✅ **Good fit:**
- Bug fixes (especially with a reproduction)
- Small features (< 100 lines of change)
- Refactoring a single function or file
- Adding a test for existing code
- Documentation updates
- Config changes

❌ **Not a good fit:**
- Changes spanning 5+ files → consider **Meta Thread** to decompose
- Risky changes (auth, payments, infra) → use **Chained Thread**
- Work you could parallelize → use **Parallel Thread**
- Architectural decisions → use **Fusion Thread**

---

## The Lab 1 Bug

There's a bug in `src/routes/users.ts` in the `getUserPreferences` function. It doesn't check if `user` or `user.preferences` exists before accessing properties.

**Current test status:**
```bash
bun test tests/routes/users.test.ts
# FAIL - "should handle user with no preferences"
```

Your task: Fix this bug using a Base Thread.

---

## Setup

### 1. Create your branch

```bash
git checkout -b thread/base/lab-1-fix-null-check
```

### 2. Start Claude Code

```bash
claude
```

### 3. Enter Plan Mode

Press `Shift+Tab` twice. You should see a "plan" indicator.

Plan Mode ensures Claude explains its approach before making changes. This is critical — skipping planning is the #1 cause of Base Thread failures.

---

## The Prompt

Copy and paste this entire prompt into Claude Code:

```
I need you to complete a focused task. Follow this structure:

## Task
Fix the null check bug in `src/routes/users.ts`. The `getUserPreferences` function crashes when a user has no preferences set.

## Context
- The test `tests/routes/users.test.ts` has a failing test: "should handle user with no preferences"
- The function should return sensible defaults when preferences don't exist
- Don't change the function signature or return type

## Constraints
- Only modify `src/routes/users.ts`
- Do not refactor unrelated code
- Keep changes minimal and focused

## Process
1. **Plan**: First, read `src/routes/users.ts` and `tests/routes/users.test.ts`. Explain what's wrong and how you'll fix it.
2. **Implement**: Make the fix.
3. **Verify**: Run `bun test tests/routes/users.test.ts`. All tests must pass.
4. **Summarize**: Before committing, provide:
   - What you changed and why
   - The test results
   - Any concerns or follow-up items

Stop after the summary for my review before committing.
```

---

## Walkthrough

Here's what a successful Base Thread looks like, step by step:

### Step 1: You paste the prompt

Claude receives the task with clear structure.

### Step 2: Claude plans (Plan Mode)

Claude reads the files and responds with something like:

> **Plan**
>
> I've read both files. Here's the issue:
>
> In `src/routes/users.ts`, line 23-27, `getUserPreferences` accesses `user.preferences.theme` directly without checking if `user` exists or if `user.preferences` exists.
>
> ```typescript
> // Current (buggy)
> return {
>   theme: user.preferences.theme,
>   notifications: user.preferences.notifications,
>   language: user.preferences.language,
> };
> ```
>
> **Fix approach:**
> 1. Add null check for `user`
> 2. Add null check for `user.preferences`
> 3. Return defaults when preferences don't exist
>
> Defaults will be: `{ theme: 'light', notifications: true, language: 'en' }`
>
> Does this approach look right?

**Your move:** Review the plan. If it looks wrong, correct it now (cheap). If it looks right, say "Proceed."

### Step 3: Claude implements

Claude makes the changes:

```typescript
// Fixed
export async function getUserPreferences(userId: string) {
  const user = await findUser(userId);
  
  if (!user) {
    return null;
  }
  
  const defaults = {
    theme: 'light',
    notifications: true,
    language: 'en',
  };
  
  if (!user.preferences) {
    return defaults;
  }
  
  return {
    theme: user.preferences.theme ?? defaults.theme,
    notifications: user.preferences.notifications ?? defaults.notifications,
    language: user.preferences.language ?? defaults.language,
  };
}
```

### Step 4: Claude verifies

Claude runs the tests:

> Running `bun test tests/routes/users.test.ts`...
>
> ```
> ✓ should return preferences for existing user
> ✓ should handle user with no preferences
> ✓ should return null for non-existent user
>
> 3 tests passed
> ```

### Step 5: Claude summarizes

> **Summary**
>
> **Changed:** `src/routes/users.ts`
> - Added null check for `user` (returns null if not found)
> - Added null check for `user.preferences` (returns defaults if missing)
> - Used nullish coalescing (`??`) to handle individual missing fields
>
> **Test results:** All 3 tests passing
>
> **Concerns:** None. The fix is minimal and focused.
>
> Ready to commit?

### Step 6: Commit

Tell Claude to commit:

```
Commit with message "fix: handle null preferences in getUserPreferences" and push
```

---

## Verify Your Lab Completion

```bash
bun run verify 1
```

Expected output:
```
Checking Lab 1: Base Thread...
✅ Null check exists in getUserPreferences
✅ All tests in tests/routes/users.test.ts pass
✅ No unrelated files modified

Result: PASS
```

---

## Next Lab

Continue to **[Lab 2: Parallel Thread](lab-2-parallel-thread.md)** to learn how to run multiple independent tasks simultaneously.

---

## Reference (Optional)

The sections below are for troubleshooting, deeper learning, and advanced variations. Skip if you're ready for Lab 2.

---

## Success Criteria

Your Base Thread succeeded if:

- [ ] Only `src/routes/users.ts` was modified
- [ ] All tests pass (`bun test tests/routes/users.test.ts`)
- [ ] Claude provided a clear summary before committing
- [ ] You understood the fix without reading every line
- [ ] Completed in under 30 minutes

---

## Failure Patterns

### "Claude started changing other files"

**Why:** Task description was too vague, or you skipped Plan Mode.

**Fix:** Always use Plan Mode. Be specific about scope: "Only modify `src/routes/users.ts`."

### "Claude's plan looked fine but implementation was wrong"

**Why:** Plan was too high-level.

**Fix:** Ask for specifics: "Which lines will you modify? Show me the before/after."

### "Tests still failing after the fix"

**Why:** Either the fix was incomplete, or tests expect specific behavior.

**Fix:** Ask Claude to read the test file more carefully: "Read the test assertions. What exactly does the test expect?"

### "Session dragged on for 45+ minutes"

**Why:** Task might be bigger than expected, or you're being too perfectionist.

**Fix:** For Lab 1, the fix should be <20 lines. If Claude is proposing a larger refactor, pull it back: "Keep it simple. Just fix the null check, nothing else."

---

## Variations

### Quick Mode (for trivial fixes)

If you're confident the fix is tiny, shorten the prompt:

```
Fix the null check bug in src/routes/users.ts. Run tests after. Summarize before committing.
```

Use sparingly — skipping the plan works only for truly trivial changes.

### With Slash Command

Create `.claude/commands/base-thread.md`:

```markdown
---
description: Start a focused base thread
---

# Context
!`git status --short`
!`bun test --dry-run`

# Instructions
Complete this focused task:
1. **Plan**: Read relevant files, explain your approach
2. **Implement**: Make minimal changes
3. **Verify**: Run `bun test`
4. **Summarize**: What changed, test results, concerns

Stop after summary for review.

## Task
$TASK
```

Then run: `/base-thread Fix null check in src/routes/users.ts`

---

## Retrospective Questions

After completing Lab 1, ask yourself:

- Did the plan step catch any issues before implementation?
- Was the scope appropriately constrained?
- Did Claude's summary accurately reflect the changes?
- How long did it take vs. doing it manually?

---

*Base Thread is the atomic unit. Master it before scaling up.*
