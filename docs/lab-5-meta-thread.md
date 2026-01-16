# Lab 5: Meta Thread

**Time:** 30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Labs 1-2 (Base Thread, Parallel Thread)

---

## What is a Meta Thread?

A Meta Thread decomposes large, overwhelming work into 3-8 smaller, executable child threads. Instead of starting a massive task and getting lost, you first create a "thread map" that breaks it into manageable pieces.

Think of it as project planning, but for AI-assisted work. Each child thread becomes a Base Thread, Parallel Thread, or Chained Thread.

---

## Why Meta Threads Matter

**The problem with starting big work directly:**
- "Add a notification system" → where do you even start?
- Claude makes 50 changes across 20 files
- You lose track of what's done vs. pending
- Bugs are hard to isolate
- No sense of progress

**What Meta Threads give you:**
- Visible checklist of work
- Each piece is independently testable
- Clear dependencies (what blocks what)
- Parallelization opportunities
- Progress tracking

Use Meta Threads when you look at a task and feel overwhelmed.

---

## When to Use a Meta Thread

✅ **Good fit:**
- Multi-day features
- Large refactors
- System integrations
- Any task that would take 3+ hours
- Work where you're not sure where to start

❌ **Not a good fit:**
- Work that's obviously one task → **Base Thread**
- Already decomposed tasks → just start
- Exploratory/research work → **Fusion Thread** first

**Rule of thumb:** If you'd need to write a project plan for humans, use a Meta Thread.

---

## The Lab 5 Feature

Read the feature spec at `docs/feature-notification-preferences.md`:

```markdown
# Feature: Notification Preferences

Users should be able to:
- Set notification channels (email, in-app, push)
- Configure per-event notification rules
- Set quiet hours
- View notification history
```

This is too big for a single Base Thread. Your task: Decompose it into a thread map.

---

## Thread Map Output

A good Meta Thread produces a map with:

| Field | Description |
|-------|-------------|
| **Thread ID** | Unique identifier (e.g., NP-1) |
| **Name** | Clear, action-oriented title |
| **Type** | Base / Parallel / Chained |
| **Scope** | Which files/modules |
| **Definition of Done** | Testable completion criteria |
| **Dependencies** | Which threads must complete first |
| **Estimated Time** | 30-90 min target |

---

## Setup

### 1. Create your branch

```bash
git checkout -b thread/meta/lab-5-notification-decomposition
```

### 2. Read the feature spec

```bash
cat docs/feature-notification-preferences.md
```

### 3. Start Claude Code

```bash
claude
```

### 4. Enter Plan Mode

Press `Shift+Tab` twice.

---

## The Prompt

```
I need to decompose a large feature into executable child threads. Create a thread map.

## Feature
Notification Preferences system for a Hono/TypeScript application.

Requirements:
- CRUD API for notification preferences
- Notification channels: email, in-app, push
- Per-event notification rules (user chooses what triggers notifications)
- Quiet hours (don't notify during specified times)
- Notification history (log of sent notifications)

## Current Codebase Context
- User model exists in `src/types/index.ts`
- Email service exists in `src/services/email.ts`
- No notification code exists yet
- Auth middleware exists in `src/middleware/auth.ts`
- Database: SQLite via Bun (see architecture decision)

## Your Task

Create a thread map with 4-7 child threads. For each thread provide:

1. **Thread ID**: Unique identifier (NP-1, NP-2, etc.)
2. **Name**: Action-oriented (e.g., "Create preferences schema")
3. **Thread Type**: Base, Parallel, or Chained
4. **Scope**: Specific files to create/modify
5. **Definition of Done**: Testable criteria (tests pass, endpoint works, etc.)
6. **Dependencies**: Which threads must complete first (or "None")
7. **Estimated Time**: Target 30-90 min each
8. **Risks/Notes**: Anything to watch out for

Then provide:
- **Dependency graph**: Visual showing execution order
- **Recommended sequence**: Which threads to tackle first
- **Parallelization opportunities**: Which can run simultaneously

Make threads small enough to complete in one session but large enough to be meaningful.
```

---

## Walkthrough

Claude produces a thread map:

> **Thread Map: Notification Preferences**
>
> ---
>
> ### NP-1: Database Schema
> - **Type:** Base Thread
> - **Scope:** `src/db/schema.ts`, `src/db/migrations/`
> - **DoD:** Schema exists, tables created, migration runs
> - **Dependencies:** None
> - **Time:** 30 min
> - **Notes:** Foundation for everything else
>
> ---
>
> ### NP-2: Preferences CRUD API
> - **Type:** Base Thread
> - **Scope:** `src/routes/preferences.ts`, `tests/routes/preferences.test.ts`
> - **DoD:** GET/POST/PUT/DELETE endpoints work, tests pass
> - **Dependencies:** NP-1
> - **Time:** 45 min
> - **Notes:** Core API, needed before UI
>
> ---
>
> ### NP-3: Notification Dispatcher Service
> - **Type:** Chained Thread (risky — touches email service)
> - **Scope:** `src/services/dispatcher.ts`, `src/services/email.ts`
> - **DoD:** Dispatcher routes to correct channel, tests pass
> - **Dependencies:** NP-1
> - **Time:** 60 min
> - **Notes:** Phase 1: plan. Phase 2: implement. Phase 3: verify.
>
> ---
>
> ### NP-4: Quiet Hours Logic
> - **Type:** Base Thread
> - **Scope:** `src/utils/quietHours.ts`, `tests/utils/quietHours.test.ts`
> - **DoD:** `isQuietHours()` function works, respects user timezone
> - **Dependencies:** NP-1, NP-2
> - **Time:** 30 min
> - **Notes:** Pure utility, easy to test in isolation
>
> ---
>
> ### NP-5: Notification History
> - **Type:** Base Thread
> - **Scope:** `src/routes/history.ts`, `src/db/schema.ts` (add table)
> - **DoD:** History logged on send, GET endpoint returns logs
> - **Dependencies:** NP-3
> - **Time:** 45 min
> - **Notes:** Depends on dispatcher existing
>
> ---
>
> ### NP-6: Integration Tests
> - **Type:** Base Thread
> - **Scope:** `tests/integration/notifications.test.ts`
> - **DoD:** End-to-end flow tested: set prefs → trigger event → notification sent → logged
> - **Dependencies:** NP-1 through NP-5
> - **Time:** 45 min
> - **Notes:** Final validation, catches integration bugs
>
> ---
>
> **Dependency Graph:**
> ```
>        NP-1 (Schema)
>        /    \
>     NP-2    NP-3
>       |      |
>     NP-4   NP-5
>       \     /
>        NP-6
> ```
>
> **Recommended Sequence:**
> 1. NP-1 first (unblocks everything)
> 2. NP-2 and NP-3 in parallel (independent)
> 3. NP-4 after NP-2
> 4. NP-5 after NP-3
> 5. NP-6 last (integration)
>
> **Parallelization:**
> - NP-2 || NP-3 (both depend only on NP-1)
> - NP-4 || NP-5 (different dependencies, no file overlap)

---

## Refine the Map

Review and challenge:

- Are any threads too big? (>90 min → split)
- Are any too small? (<20 min → merge)
- Do dependencies make sense?
- Is anything missing?

Ask Claude:
- "NP-3 seems big. Can you split it?"
- "What about push notifications? Is that a separate thread?"
- "How do we handle the case where email service fails?"

Iterate until the map feels right.

---

## Save the Thread Map

Save to `docs/thread-map-notification-preferences.md`:

```markdown
# Thread Map: Notification Preferences

**Created:** [Date]
**Status:** Planning complete

## Threads

### NP-1: Database Schema
[Details]

### NP-2: Preferences CRUD API
[Details]

...

## Execution Order
1. NP-1
2. NP-2 || NP-3
3. NP-4 || NP-5
4. NP-6

## Notes
- Estimated total time: 4-5 hours
- Can complete in 2 parallel lanes after NP-1
```

---

## Verify Your Lab Completion

```bash
bun run verify 5
```

Expected output:
```
Checking Lab 5: Meta Thread...
✅ Thread map document exists
✅ At least 4 threads defined
✅ Each thread has DoD
✅ Dependencies documented
✅ Execution order specified

Result: PASS
```

---

## Next Lab

Continue to **[Lab 6: Long Thread](lab-6-long-thread.md)** to learn how to automate mechanical grunt work.

---

## Reference (Optional)

The sections below are for troubleshooting, deeper learning, and advanced variations. Skip if you're ready for Lab 6.

---

## Success Criteria

Your Meta Thread succeeded if:

- [ ] Produced 4-7 threads (not too few, not too many)
- [ ] Each thread is 30-90 min (independently completable)
- [ ] Scopes don't overlap (no merge conflicts)
- [ ] Definitions of Done are testable
- [ ] Dependencies form a clear graph
- [ ] You could hand any thread to someone else

---

## Failure Patterns

### "Threads are still too big"

**Why:** Didn't split enough.

**Fix:** Any thread >90 min should be split. Ask: "Can this be done in two sessions?"

### "Threads overlap in scope"

**Why:** Files appear in multiple threads.

**Fix:** Restructure. Either merge overlapping threads or make one depend on the other.

### "Dependencies are a mess"

**Why:** Too many circular or complex dependencies.

**Fix:** Look for independent chunks. If A needs B and B needs A, they're actually one thread.

### "Planning fatigue"

**Why:** Spent too long on the map.

**Fix:** Timebox to 30 min. Imperfect plan + execution beats perfect plan + no execution. You can adjust as you go.

---

## Variations

### Quick Meta (Bullet List)

For simpler decomposition:

```
Break "add notification preferences" into 4-6 tasks. Just bullet points with file scope and done criteria.
```

### Meta + Fusion

For uncertain work, combine patterns:

1. **Fusion Thread:** Decide the approach (e.g., which notification service)
2. **Meta Thread:** Decompose the chosen approach

### Rolling Meta

For very large work:

1. Meta Thread → plan first 3 threads in detail
2. Execute those
3. Meta Thread → plan next 3 threads (informed by what you learned)

---

## Retrospective Questions

- Did decomposition reveal complexity you hadn't considered?
- Are the threads truly independent?
- Could you parallelize more than you initially thought?
- How long did planning take vs. expected execution?

---

*Meta Threads turn overwhelming projects into checklists.*
