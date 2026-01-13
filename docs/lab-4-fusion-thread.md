# Lab 4: Fusion Thread

**Time:** 30-45 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Lab 1 (Base Thread)

---

## What is a Fusion Thread?

A Fusion Thread gathers multiple perspectives on a hard problem, then synthesizes them into a clear decision. Instead of asking one Claude session for an answer, you run 2-4 parallel sessions with the same prompt, optionally add external models (Gemini, GPT), and then have a fresh Claude session analyze all responses.

It's like getting opinions from multiple experts, then having a senior architect synthesize the recommendation.

---

## Why Fusion Threads Matter

**The problem with single-perspective answers:**
- Claude's first answer might miss trade-offs
- Confirmation bias (you asked, it agrees)
- No exposure to alternative approaches
- Hard to know if you're missing something

**What Fusion Threads give you:**
- Multiple independent analyses
- Disagreement surfaces hidden issues
- Synthesis forces clear reasoning
- Documented decision with rationale

Use Fusion Threads when the decision matters and isn't obvious.

---

## When to Use a Fusion Thread

✅ **Good fit:**
- Architecture decisions (database choice, API design)
- Technology selection (framework, library, service)
- Debugging mysteries (multiple hypotheses)
- Design trade-offs (security vs. UX, speed vs. correctness)
- Any decision you'd normally discuss with teammates

❌ **Not a good fit:**
- Simple implementation tasks → **Base Thread**
- Well-documented solutions → just implement it
- Personal preference questions → no synthesis needed
- Time-sensitive fixes → too slow

**Rule of thumb:** If you'd want 3 senior engineers to weigh in, use a Fusion Thread.

---

## The Lab 4 Decision

The codebase needs session storage. There's a decision document at `docs/architecture-decision.md` outlining four options:

1. **In-memory store** — Map in the app
2. **Redis** — External service
3. **SQLite** — File-based via Bun
4. **JWT-only** — Stateless, no server storage

Your task: Use a Fusion Thread to decide which approach is best for this training repo.

---

## Fusion Sources

### Primary Sources: Multiple Claude Sessions

Run the same prompt in 2-3 Claude sessions (terminal + web). Each session has fresh context and may emphasize different factors.

### Secondary Sources: External Models (Optional)

For more diversity, add:
- **Gemini** — Often emphasizes different trade-offs
- **GPT-4** — Different training, different blind spots
- **Codex/Copilot** — Code-focused perspective

External models add diversity but may hallucinate about your specific codebase. Weight Claude higher for repo-specific questions.

---

## The Two-Stage Process

### Stage 1: Gathering

Run the same prompt in multiple lanes. Collect independent responses.

### Stage 2: Synthesis

Give all responses to a fresh Claude session. Ask for:
- Where do they agree?
- Where do they disagree?
- What's the best recommendation?
- What's the implementation plan?

---

## Setup

### 1. Prepare Your Lanes

You'll need 3-4 perspectives. Options:

**Option A: All Claude (simplest)**
- Terminal 1: Claude Code
- Terminal 2: Claude Code (different directory)
- Browser: claude.ai/chat

**Option B: Claude + External (more diversity)**
- Terminal: Claude Code
- Browser 1: claude.ai/chat
- Browser 2: Gemini or ChatGPT

### 2. Read the Decision Context

```bash
cat docs/architecture-decision.md
```

Understand the problem before gathering perspectives.

---

## Stage 1: The Gathering Prompt

Use this EXACT prompt in all lanes:

```
I need your analysis on an architecture decision. Answer independently — don't hedge or say "it depends" without committing to a recommendation.

## Context
We need to add user session management to a Hono/TypeScript training application. The codebase is:
- Runtime: Bun
- Framework: Hono
- Purpose: Training repo for Claude Code workflows
- Scale: Small (training exercises, not production)
- Constraint: Should work without external dependencies if possible

## Options

1. **In-memory Map**
   - Simple Map object in the app
   - Lost on restart
   - No dependencies

2. **Redis**
   - External Redis service
   - Persistent, scalable
   - Requires Docker or cloud service

3. **SQLite via Bun**
   - File-based database
   - Persistent, no external service
   - Bun has built-in SQLite support

4. **JWT-only (stateless)**
   - All session data in the token
   - No server storage needed
   - Can't invalidate individual sessions

## Your Task

Provide:

1. **Recommendation**: Which option and why (one clear choice)
2. **Trade-offs**: What you're giving up with this choice
3. **Risks**: What could go wrong
4. **Alternatives considered**: Why you rejected the others
5. **Confidence level**: High / Medium / Low and why

Be direct. Take a position.
```

---

## Stage 1: Walkthrough

### Run the prompt in each lane

**Lane 1 (Claude Code):**
> **Recommendation: SQLite via Bun**
> 
> SQLite is the best fit because:
> - Persistent without external services
> - Bun has native SQLite support (`bun:sqlite`)
> - Perfect for training context — real database patterns without Docker
> - Supports session invalidation (unlike JWT-only)
>
> **Trade-offs:** Slightly more setup than in-memory
> **Risks:** File permissions, concurrent write limits
> **Confidence:** High

**Lane 2 (Claude Web):**
> **Recommendation: In-memory Map with optional persistence**
>
> For a training repo, simplicity wins:
> - Zero dependencies
> - Easy to understand
> - Students focus on workflow, not infrastructure
> - Add JSON file persistence if needed later
>
> **Trade-offs:** Lost on restart
> **Risks:** Memory leaks if sessions aren't cleaned
> **Confidence:** Medium-High

**Lane 3 (Gemini):**
> **Recommendation: JWT-only**
>
> Stateless is cleanest:
> - No server storage complexity
> - Scales infinitely
> - Simpler code
> - Modern approach
>
> **Trade-offs:** Can't invalidate sessions server-side
> **Risks:** Token size limits, can't log out users
> **Confidence:** Medium

Now you have three different recommendations with different reasoning.

---

## Stage 2: The Synthesis Prompt

Open a **fresh Claude session** (terminal or web). Paste:

```
I gathered multiple perspectives on an architecture decision. Synthesize them into a final recommendation.

## The Question
Which session storage approach for a Hono/TypeScript training application?

## Perspective 1 (Claude Terminal)
**Recommendation: SQLite via Bun**
- Persistent without external services
- Bun has native SQLite support
- Real database patterns without Docker
- Supports session invalidation

Trade-offs: More setup than in-memory
Risks: File permissions, concurrent writes
Confidence: High

## Perspective 2 (Claude Web)
**Recommendation: In-memory Map**
- Zero dependencies
- Easy to understand
- Students focus on workflow, not infrastructure

Trade-offs: Lost on restart
Risks: Memory leaks
Confidence: Medium-High

## Perspective 3 (Gemini)
**Recommendation: JWT-only**
- No server storage complexity
- Scales infinitely
- Modern approach

Trade-offs: Can't invalidate sessions
Risks: Token size, no logout capability
Confidence: Medium

## Your Task

Analyze these perspectives and provide:

1. **Where they agree**: Common ground across all three
2. **Where they disagree**: Key points of contention
3. **Best ideas from each**: What's worth keeping
4. **Gaps**: What did they all miss?
5. **Final recommendation**: ONE clear choice with full rationale
6. **Implementation plan**: Concrete next steps (3-5 items)
7. **Risk mitigations**: How to address the main risks

Be decisive. Don't waffle.
```

---

## Stage 2: Walkthrough

Claude synthesizes:

> **Synthesis**
>
> **Where they agree:**
> - External services (Redis) are overkill for a training repo
> - Simplicity matters for learning context
> - Session invalidation is a nice-to-have
>
> **Where they disagree:**
> - Persistence: SQLite and JWT-only have it; in-memory doesn't
> - Complexity: In-memory is simplest; SQLite adds database concepts
> - Statefulness: JWT is stateless; others are stateful
>
> **Best ideas from each:**
> - SQLite: Real database patterns are valuable for training
> - In-memory: Simplicity wins for learning
> - JWT-only: Stateless is a legitimate modern pattern
>
> **Gaps:**
> - None addressed what happens in Lab exercises specifically
> - None considered that students might need to see session data (debugging)
>
> **Final Recommendation: SQLite via Bun**
>
> **Rationale:**
> For a training repo teaching Claude Code workflows, SQLite is optimal because:
> 1. Zero external dependencies (no Docker/Redis)
> 2. Bun's native support makes it trivial (`import { Database } from 'bun:sqlite'`)
> 3. Teaches real patterns (schema, queries, migrations)
> 4. Students can inspect session data (better debugging)
> 5. Survives restart (persistent lab state)
>
> In-memory was close, but persistence helps when students take breaks or restart.
> JWT-only was rejected because session invalidation may be needed for auth labs.
>
> **Implementation Plan:**
> 1. Create `src/db/index.ts` with Bun SQLite setup
> 2. Create sessions table schema
> 3. Add `createSession`, `getSession`, `deleteSession` functions
> 4. Integrate with auth middleware
> 5. Add cleanup job for expired sessions
>
> **Risk Mitigations:**
> - File permissions: Document in README, use standard `./data/` directory
> - Concurrent writes: Use WAL mode, add connection pooling
> - Learning curve: Provide example queries in CLAUDE.md

---

## Document the Decision

Save the synthesis output to `docs/architecture-decision.md`:

```markdown
# Architecture Decision: Session Storage

**Date:** [Today]
**Decision:** SQLite via Bun
**Status:** Accepted

## Context
[Original problem statement]

## Options Considered
[List all four options]

## Analysis
[Summary of perspectives gathered]

## Decision
SQLite via Bun native support.

## Rationale
[Key points from synthesis]

## Implementation Plan
[Concrete steps]

## Consequences
[Trade-offs accepted]
```

---

## Verify Your Lab Completion

```bash
bun run verify 4
```

Expected output:
```
Checking Lab 4: Fusion Thread...
✅ docs/architecture-decision.md has been updated
✅ Decision section exists with clear choice
✅ Rationale section exists
✅ Implementation plan exists

Result: PASS
```

---

## Success Criteria

Your Fusion Thread succeeded if:

- [ ] You gathered 3+ genuinely different perspectives
- [ ] Synthesis identified both agreements and disagreements
- [ ] Final recommendation is clear and decisive
- [ ] Rationale explains why alternatives were rejected
- [ ] Implementation plan is concrete (not vague)
- [ ] Decision is documented

---

## Failure Patterns

### "All perspectives gave the same answer"

**Why:** Not enough diversity in sources.

**Fix:** Add external models (Gemini, GPT). Or re-prompt with "argue for [alternative]" to force different perspectives.

### "Synthesis was wishy-washy"

**Why:** Synthesis prompt didn't demand decisiveness.

**Fix:** Add to prompt: "You MUST pick one option. 'It depends' is not acceptable."

### "External models hallucinated about the codebase"

**Why:** They don't have repo context.

**Fix:** Weight Claude perspectives higher for codebase-specific questions. Use external models for general architecture trade-offs.

---

## Variations

### Quick Fusion (10-15 min)

For simpler decisions, use just 2 Claude sessions:
- Terminal: One perspective
- Web: Force a different take ("Argue for [alternative]")
- Synthesize yourself (no third session)

### Debugging Fusion

For mystery bugs:
- Lane 1: "Here's the bug. What's your hypothesis?"
- Lane 2: Same prompt
- Lane 3: Same prompt
- Synthesis: "Which hypothesis is most likely? How do we test?"

### Code Review Fusion

For reviewing a PR:
- Lane 1: "Review for correctness"
- Lane 2: "Review for security"
- Lane 3: "Review for performance"
- Synthesis: "Unified review with prioritized issues"

---

## Retrospective Questions

- Did multiple perspectives surface anything you'd have missed?
- Which source gave the most useful input?
- Was synthesis easier or harder than expected?
- How would you use this for a real decision?

---

## Next Lab

Once you're comfortable gathering and synthesizing perspectives, move to **Lab 5: Meta Thread** to learn how to decompose large work into manageable threads.

```bash
git checkout main
# Lab 5 is also a planning exercise - read docs/feature-notification-preferences.md
```

---

*Fusion Threads turn individual opinions into informed decisions.*
