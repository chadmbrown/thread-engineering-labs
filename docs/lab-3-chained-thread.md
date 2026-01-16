# Lab 3: Chained Thread

**Time:** 30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Lab 1 (Base Thread)

---

## What is a Chained Thread?

A Chained Thread breaks risky work into phases with human checkpoints between them. Instead of letting Claude make all changes at once, you pause after each phase to verify before continuing.

Think of it as "measure twice, cut once" — but with AI. You approve the plan before implementation, and you verify implementation before considering it done.

---

## Why Chained Threads Matter

**The risk with Base Threads on complex work:**
- Claude makes 15 changes across 8 files
- Something is wrong, but you're not sure what
- Rolling back means losing all progress
- Debugging is painful

**What Chained Threads give you:**
- Explicit approval gates
- Smaller, reviewable chunks
- Easy rollback to last checkpoint
- Confidence on risky changes

Use Chained Threads when the cost of getting it wrong is high.

---

## When to Use a Chained Thread

✅ **Good fit:**
- Authentication/authorization changes
- Database schema migrations
- Infrastructure/config changes
- Refactoring core modules
- Payment processing code
- Any change that's hard to undo

❌ **Not a good fit:**
- Simple bug fixes → **Base Thread**
- Isolated changes → **Base Thread**
- Work that's easily reversible → **Base Thread**
- Multiple independent tasks → **Parallel Thread**

**Rule of thumb:** If you'd want a human to review before it goes live, use a Chained Thread.

---

## The Lab 3 Issue

The auth middleware in `src/middleware/auth.ts` validates tokens but **doesn't check if they're expired**.

This is a security-sensitive change — exactly the kind of work that needs a Chained Thread.

**Current behavior:**
- Token exists? ✅ Check
- Token signature valid? ✅ Check  
- Token expired? ❌ Not checked!

**Required change:**
- Add `isTokenExpired()` utility function
- Add expiration check in `authMiddleware`
- Add tests for expired tokens
- Document rollback strategy

---

## The Three Phases

Every Chained Thread follows this structure:

### Phase 1: Plan
Claude analyzes the problem, identifies affected files, proposes approach, lists risks, and defines a rollback strategy.

**You review:** Does this plan make sense? Are the risks acceptable?

### Phase 2: Implement
Claude makes the changes according to the approved plan.

**You review:** Do the changes match the plan? Any unexpected modifications?

### Phase 3: Verify
Claude runs tests, checks for regressions, validates the change works.

**You review:** Tests pass? Ready to ship?

---

## Setup

### 1. Create your branch

```bash
git checkout -b thread/chained/lab-3-auth-expiration
```

### 2. Start Claude Code

```bash
claude
```

### 3. Enter Plan Mode

Press `Shift+Tab` twice. This is critical for Chained Threads.

Plan Mode ensures Claude cannot make file changes until you explicitly approve. This enforces the checkpoint pattern.

---

## The Prompt

Copy and paste this entire prompt:

```
I need you to complete a risky task using a phased approach with checkpoints.

## Task
Add token expiration checking to `src/middleware/auth.ts`. Currently the middleware validates token existence and signature, but doesn't check if the token is expired.

## Context
- This is security-sensitive code — we need to be careful
- The token payload includes an `exp` field (Unix timestamp)
- An expired token should return 401 with message "Token expired"
- We need tests for the new behavior

## Files Involved
- `src/middleware/auth.ts` — Add expiration check
- `src/utils/tokens.ts` — Add `isTokenExpired()` helper (create if needed)
- `tests/middleware/auth.test.ts` — Add expired token tests

## Process — Follow These Phases Exactly

### PHASE 1: Planning (Do this now)
1. Read `src/middleware/auth.ts` to understand current implementation
2. Create a detailed plan:
   - What changes to each file
   - Order of changes
   - New function signatures
3. Risk assessment:
   - What could break?
   - What if we need to rollback?
4. Rollback strategy:
   - Exact steps to undo this change
   
**STOP after Phase 1. Say "Awaiting approval — reply 'proceed' when ready for Phase 2."**

### PHASE 2: Implementation (Only after I approve Phase 1)
1. Create `isTokenExpired()` utility if needed
2. Add expiration check to `authMiddleware`
3. Add test cases for expired tokens
4. List all changes made

**STOP after Phase 2. Say "Awaiting review — reply 'proceed' when ready for Phase 3."**

### PHASE 3: Verification (Only after I approve Phase 2)
1. Run `bun test tests/middleware/auth.test.ts`
2. Run `bun run typecheck`
3. Run `bun run lint`
4. Report all results

**STOP for final review. Say "Awaiting final review — reply 'commit' when ready."**

## Critical Rules
- Do NOT proceed to the next phase without my explicit "approved" or "proceed"
- If you encounter something unexpected, STOP and tell me
- Stay within the scope of the approved plan
```

---

## Walkthrough

### Step 1: You paste the prompt

Claude receives the phased task structure.

### Step 2: Phase 1 — Claude Plans

Claude reads the files and produces:

> **Phase 1: Plan**
>
> **Current Implementation Analysis:**
> The `authMiddleware` in `src/middleware/auth.ts` currently:
> 1. Extracts token from Authorization header
> 2. Verifies token signature with `verifyToken()`
> 3. Sets user in context
>
> Missing: No check for `decoded.exp` against current time.
>
> **Proposed Changes:**
>
> 1. `src/utils/tokens.ts` (create new file):
>    ```typescript
>    export function isTokenExpired(exp: number): boolean {
>      return Date.now() >= exp * 1000;
>    }
>    ```
>
> 2. `src/middleware/auth.ts` (lines 15-20):
>    - Import `isTokenExpired`
>    - After `verifyToken()` succeeds, check `isTokenExpired(decoded.exp)`
>    - If expired, return 401 "Token expired"
>
> 3. `tests/middleware/auth.test.ts`:
>    - Add test: expired token returns 401
>    - Add test: valid non-expired token passes
>
> **Risks:**
> - If `exp` field is missing from token, `isTokenExpired()` could error
>   - Mitigation: Add null check, treat missing exp as not expired (or expired, your call)
> - Existing valid tokens might fail if server time is wrong
>   - Mitigation: Log server time in error for debugging
>
> **Rollback Strategy:**
> ```bash
> git revert HEAD  # Single commit, clean revert
> ```
> No database changes, no external dependencies affected.
>
> **Awaiting your approval to proceed to Phase 2.**

### Step 3: You review Phase 1

Questions to consider:
- Does the approach make sense?
- Is the risk mitigation adequate?
- Is the rollback realistic?

If something's off: *"What happens if decoded.exp is undefined? Add a check for that."*

If it looks good: **"Phase 1 approved. Proceed to Phase 2."**

### Step 4: Phase 2 — Claude Implements

Claude makes the changes:

> **Phase 2: Implementation Complete**
>
> **Created:** `src/utils/tokens.ts`
> ```typescript
> export function isTokenExpired(exp: number | undefined): boolean {
>   if (!exp) return false; // No expiration = doesn't expire
>   return Date.now() >= exp * 1000;
> }
> ```
>
> **Modified:** `src/middleware/auth.ts`
> - Added import for `isTokenExpired`
> - Added expiration check after line 18
> - Returns `{ error: "Token expired" }` with 401 if expired
>
> **Modified:** `tests/middleware/auth.test.ts`
> - Added test: "should reject expired token"
> - Added test: "should accept valid non-expired token"
>
> **Awaiting your review before Phase 3.**

### Step 5: You review Phase 2

Check: Do changes match the plan? Ask to see diffs if needed.

If okay: **"Phase 2 approved. Proceed to Phase 3."**

### Step 6: Phase 3 — Claude Verifies

> **Phase 3: Verification**
>
> Running `bun test tests/middleware/auth.test.ts`:
> ```
> ✓ should return 401 when no token provided
> ✓ should return 401 for invalid token
> ✓ should reject expired token
> ✓ should accept valid non-expired token
> ✓ should set user in context for valid token
> 
> 5 tests passed
> ```
>
> Running `bun run typecheck`:
> ```
> No errors
> ```
>
> Running `bun run lint`:
> ```
> No issues found
> ```
>
> **All checks pass. Ready to commit?**

### Step 7: Approve and commit

**"Approved. Commit with message 'feat: add token expiration check to auth middleware' and push."**

---

## Verify Your Lab Completion

```bash
bun run verify 3
```

Expected output:
```
Checking Lab 3: Chained Thread...
✅ isTokenExpired function exists
✅ authMiddleware checks expiration
✅ Expired token test exists and passes
✅ All auth tests pass

Result: PASS
```

---

## Next Lab

Continue to **[Lab 4: Fusion Thread](lab-4-fusion-thread.md)** to learn how to get multiple perspectives on hard problems.

---

## Reference (Optional)

The sections below are for troubleshooting, deeper learning, and advanced variations. Skip if you're ready for Lab 4.

---

## Success Criteria

Your Chained Thread succeeded if:

- [ ] Phase 1 plan was comprehensive (no surprises in Phase 2)
- [ ] Changes in Phase 2 matched the approved plan
- [ ] Phase 3 tests all passed
- [ ] You felt confident at each checkpoint
- [ ] Rollback strategy was documented
- [ ] Completed in under 45 minutes

---

## Failure Patterns

### "Claude kept going past a checkpoint"

**Why:** Instructions weren't clear, or your response sounded like approval.

**Fix:** Be explicit: "STOP. Do NOT proceed until I say 'approved'." If Claude runs ahead, press `Escape`.

### "Phase 2 changes didn't match Phase 1 plan"

**Why:** Plan was too vague.

**Fix:** In Phase 1, require exact code examples. "Show me the exact if statement you'll add."

### "I approved Phase 1 too quickly"

**Why:** Review was rushed.

**Fix:** Take Phase 1 seriously. Read the whole plan. Ask questions. Time spent here saves debugging later.

---

## Variations

### Two-Phase (Faster)

For moderately risky work:

```
## Process
1. PHASE 1: Plan (analyze, list changes, risks, rollback) — STOP
2. PHASE 2: Implement + Verify (make changes, run tests) — STOP
```

### Four-Phase (More Safety)

For very complex changes, add a design review:

```
1. PHASE 1: Analysis — understand current state
2. PHASE 2: Design — propose architecture
3. PHASE 3: Implement — build it
4. PHASE 4: Verify — test it
```

---

## Retrospective Questions

- Did the phased approach catch anything you would have missed?
- Was any phase too long or too short?
- How confident did you feel at each checkpoint?
- What would you do differently next time?

---

*Chained Threads trade speed for safety. Use them when you can't afford to be wrong.*
