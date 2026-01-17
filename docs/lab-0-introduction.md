# Lab 0: Introduction to Thread-Based Engineering

**Time:** 15 minutes (reading + setup verification)

---

## What is Thread-Based Engineering?

Thread-Based Engineering is a methodology for multiplying your output by running AI coding sessions as discrete, purposeful "threads" rather than one long, wandering conversation.

Instead of asking Claude to "help you code," you learn to:
- Categorize work by type (quick fix vs. risky refactor vs. architectural decision)
- Choose the right thread pattern for each type
- Run multiple threads in parallel when appropriate
- Know when to kill a thread vs. push through

This approach comes from Boris Cherny, creator of Claude Code at Anthropic. He runs 10-15 Claude sessions simultaneously, ships 250+ PRs per month, and calls his setup "surprisingly vanilla." The power isn't in exotic tooling — it's in disciplined patterns.

---

## Why This Matters

**Without thread thinking:**
- One long conversation that drifts off-topic
- Context window fills with irrelevant history
- No clear "done" state
- Hard to parallelize work
- Failures feel expensive (you've invested 45 minutes)

**With thread thinking:**
- Each thread has one job, clear scope, defined exit
- Fresh context for each task
- Parallel threads on independent work
- ~15% failure rate is expected and cheap
- Faster time-to-PR, higher quality output

---

## The 6 Thread Types

| Thread Type | Use When | Time |
|-------------|----------|------|
| **Base Thread** | Small, isolated task (bugfix, tiny feature) | 30 min |
| **Parallel Thread** | Multiple independent tasks (docs + tests + fixes) | 45 min |
| **Chained Thread** | Risky changes needing checkpoints (auth, infra) | 60 min |
| **Fusion Thread** | Need multiple perspectives (architecture, debugging) | 45 min |
| **Meta Thread** | Big work that needs decomposition | 45 min |
| **Long Thread** | Mechanical grunt work (add types, lint fixes) | 60 min |

Each lab teaches one thread type with a hands-on exercise using this codebase.

### Bonus Lab

After completing the core 6 labs, an optional advanced lab is available:

| Bonus Lab | What You'll Build | Time |
|-----------|-------------------|------|
| **[Automated Fusion](bonus-automated-fusion.md)** | A `/fusion` skill that automates multi-perspective analysis | 45 min |

---

## About This Training Repo

This repository contains a small but realistic Hono/TypeScript application with **intentionally planted issues** for each lab:

| Lab | Issue Location | Problem |
|-----|----------------|---------|
| Lab 1 | `src/routes/users.ts` | Null check bug |
| Lab 2 | `docs/README.md` + `src/services/email.ts` | Incomplete docs + missing tests |
| Lab 3 | `src/middleware/auth.ts` | Missing token expiration |
| Lab 4 | Architecture decision | Needs multi-perspective analysis |
| Lab 5 | Feature spec | Needs decomposition |
| Lab 6 | `src/utils/*.ts` | Missing JSDoc comments |

**Do NOT fix these issues outside of their designated labs.** The planted issues are intentional.

---

## Environment Setup

### 1. Prerequisites

- **Bun** installed: https://bun.sh
- **Claude Code** installed: https://docs.anthropic.com/en/docs/claude-code
- **Git** installed and basic familiarity (clone, branch, commit, merge)
  - Rusty on git? Claude can explain commands as you go, or see [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

Verify:
```bash
bun --version    # Should show 1.x
claude --version # Should show version
git --version    # Should show version
```

### 2. Clone and Install

```bash
git clone https://github.com/chadmbrown/thread-engineering-labs.git
cd thread-engineering-labs
bun install
```

**Note:** All work is local. You won't push anything — this is practice.

### 3. Verify the App Works

**What you're testing:** A small user management API (Hono/TypeScript) with user routes, auth middleware, and validation utilities.

```bash
# Start dev server
bun run dev

# In another terminal, test it
curl http://localhost:3000/health
# Should return: {"status":"ok"}
```

Now run tests and lint — **both will show issues**, and that's expected:

```bash
# Run tests (expect 1 failure)
bun test

# Run lint (expect warnings)
bun run lint
```

**Target state:** 29 passing tests, 0 failures, clean lint.

**What you'll see:** 28 passing tests, 1 failure. Lint warnings about non-null assertions. Both are caused by the same planted bug in `src/routes/users.ts` — a null check issue you'll fix in Lab 1. Don't fix it yet!

### 4. Verify Claude Code Setup

The repo includes pre-configured Claude Code settings:

```bash
# Check CLAUDE.md exists
cat CLAUDE.md

# Check permissions are configured
cat .claude/settings.json
```

Start Claude Code:
```bash
claude
```

Claude will automatically load the `CLAUDE.md` context.

---

## How to Use These Labs

### Suggested Order

1. **Base Thread** — Learn the fundamentals (planning, verification, clean exit)
2. **Parallel Thread** — Scale to multiple simultaneous tasks
3. **Chained Thread** — Handle risky work with checkpoints
4. **Fusion Thread** — Get multiple perspectives on hard problems
5. **Meta Thread** — Decompose large work into manageable threads
6. **Long Thread** — Automate mechanical grunt work

### Each Lab Includes

- **What & Why** — Concept explanation
- **When to Use / When NOT to Use** — Decision guidance
- **Full Setup** — Commands, branch naming
- **Complete Prompt** — Copy-paste ready, targets the planted issue
- **Step-by-Step Walkthrough** — What to expect
- **Success Criteria** — How to know it worked
- **Failure Patterns** — What goes wrong, how to fix
- **Variations** — Advanced options

### Time Commitment

~30 minutes per lab. You can do one per day or batch them.

### Verification

After completing each lab, verify your work:

```bash
bun run verify 1  # Verify Lab 1 completion
bun run verify 2  # Verify Lab 2 completion
# etc.
```

The script will tell you if you passed or what's missing.

---

## Core Principles (Reference)

These apply across all thread types:

| Principle | Why |
|-----------|-----|
| **One thread = one branch** | Clean git history, easy to abandon |
| **Plan before execute** | Use Plan Mode (Shift+Tab twice) for non-trivial work |
| **Verification required** | Tests, bash checks, or manual review. 2-3x quality improvement. |
| **Timebox: 30-90 min** | Ship, split, or stop. No drift. |
| **~15% will fail** | Kill stuck threads early. This is normal. |
| **Fresh context wins** | New thread > long conversation |

---

## Development Workflow

From Boris Cherny's CLAUDE.md:

```bash
# Always use bun, not npm

# 1. Make changes

# 2. Typecheck (fast)
bun run typecheck

# 3. Run tests
bun test                        # All tests
bun test tests/routes           # Specific directory
bun test --watch                # Watch mode

# 4. Lint before committing
bun run lint                    # Check
bun run format                  # Fix

# 5. Before creating PR
bun run lint && bun test
```

---

## Quick Reference: Claude Code Commands

| Action | Command |
|--------|---------|
| Start Claude Code | `claude` |
| Enter Plan Mode | `Shift+Tab` twice |
| Auto-accept edits | `Shift+Tab` (toggle) |
| Hand off to web | `& <task>` (inside Claude Code) |
| Bring session back | `/teleport` or `claude --teleport <id>` |
| View permissions | `/permissions` |
| View tasks | `/tasks` |

---

## Ready?

Continue to **[Lab 1: Base Thread](lab-1-base-thread.md)** to learn the fundamentals.

---

*Framework adapted from Boris Cherny's workflow and IndyDevDan's thread taxonomy.*
