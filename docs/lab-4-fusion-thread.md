# Lab 4: Fusion Thread

**Time:** 20 minutes
**Difficulty:** Intermediate
**Prerequisites:** Lab 1 (Base Thread)

---

## What is a Fusion Thread?

A Fusion Thread gathers multiple perspectives on a hard problem, then synthesizes them into a clear decision. Instead of accepting the first answer, you force different viewpoints to surface trade-offs you might otherwise miss.

It's like getting opinions from multiple experts with different priorities, then having a senior architect make the final call.

**This lab teaches the simplest form: the Virtual Roundtable** — one prompt that simulates multiple expert personas. It's fast, effective, and captures most of the value.

Want to go deeper? The [Reference section](#reference-optional) covers manual multi-session fusion for high-stakes decisions where you want true model independence. And when you're ready to let AI do all the work, **[Lab 7: Automated Fusion](lab-7-automated-fusion.md)** teaches you to build a `/fusion` skill that spawns real parallel agents with a single command.

---

## Why Fusion Threads Matter

**The problem with single-perspective answers:**
- First answer might miss trade-offs
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

The codebase needs session storage. There's a decision document at `docs/architecture-decision.md` outlining options:

1. **In-memory store** — Simple Map in the app
2. **Redis** — External service
3. **SQLite** — File-based via Bun
4. **JWT-only** — Stateless, no server storage

Your task: Use a Fusion Thread to decide which approach is best for this training repo.

---

## The Virtual Roundtable

Instead of juggling multiple terminal windows and copy-pasting between sessions, we'll use a **Virtual Roundtable** — one prompt that forces Claude to simulate multiple expert perspectives, then synthesize.

This captures 90% of the value with 10% of the overhead.

### How It Works

```
┌─────────────────────────────────────┐
│      Single Prompt Entry            │
│  "Which session storage approach?"  │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Expert A: The Pragmatist        │
│     "Stability and simplicity"      │
├─────────────────────────────────────┤
│     Expert B: The Innovator         │
│     "Scalability and modern"        │
├─────────────────────────────────────┤
│     Expert C: Devil's Advocate      │
│     "What could go wrong?"          │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Principal Architect             │
│     Synthesize → Final Decision     │
└─────────────────────────────────────┘
```

The key insight: **Named personas with explicit priorities** force diverse viewpoints even from a single model.

---

## Setup

### 1. Create your branch

```bash
git checkout -b thread/fusion/lab-4-architecture-decision
```

### 2. Read the decision context

```bash
cat docs/architecture-decision.md
```

Understand the problem before gathering perspectives.

### 3. Start Claude Code

```bash
claude
```

---

## The Prompt

Copy and paste this entire prompt:

```
I need a "Fusion Thread" analysis to decide on session storage for a Hono/TypeScript training application.

## Context
- Runtime: Bun
- Framework: Hono
- Purpose: Training repo for Claude Code workflows
- Scale: Small (training exercises, not production)
- Constraint: Should work without external dependencies if possible

## Options
1. **In-memory Map** — Simple, lost on restart, no dependencies
2. **Redis** — Persistent, scalable, requires Docker/cloud
3. **SQLite via Bun** — File-based, persistent, Bun has built-in support
4. **JWT-only (stateless)** — No server storage, can't invalidate sessions

## Your Task: Virtual Roundtable

Simulate 3 expert personas analyzing this decision, then synthesize.

### Step 1: The Roundtable

Each expert must provide independently:
- **Recommendation** (one clear choice)
- **Key argument** (why this is right)
- **Trade-off acknowledged** (what you're giving up)
- **Risk** (what could go wrong)

**Expert A (The Pragmatist):**
Prioritize stability, minimal complexity, proven patterns. Prefer boring solutions that just work.

**Expert B (The Innovator):**
Prioritize teaching value, modern patterns, real-world applicability. What would a production app use?

**Expert C (The Devil's Advocate):**
Challenge the other experts. Find edge cases, gotchas, and risks they missed. What's the contrarian take?

### Step 2: Synthesis

As a Principal Architect, review all three perspectives:

1. **Where they agree** — Common ground
2. **Where they disagree** — Key tensions
3. **Strongest point from each** — Best insights to keep
4. **Final Recommendation** — ONE clear choice
5. **Rationale** — Why this balances the perspectives
6. **Implementation Plan** — 3-5 concrete next steps

Be decisive. No "it depends" without a concrete recommendation.
```

---

## Walkthrough

### What You Should See

After pasting the prompt, Claude produces a structured analysis:

**The Roundtable:**

> **Expert A (The Pragmatist):**
> - Recommendation: In-memory Map
> - Key argument: Zero dependencies, instant setup, perfect for training
> - Trade-off: Lost on restart
> - Risk: Students might think this is production-appropriate
>
> **Expert B (The Innovator):**
> - Recommendation: SQLite via Bun
> - Key argument: Teaches real database patterns without Docker overhead
> - Trade-off: Slightly more setup than in-memory
> - Risk: File permissions on different systems
>
> **Expert C (The Devil's Advocate):**
> - Recommendation: Challenge both — what about JWT-only?
> - Key argument: Stateless is the modern pattern, no storage complexity
> - Trade-off: Can't invalidate sessions (security concern for auth labs)
> - Risk: A and B are overcomplicating a training repo

**The Synthesis:**

> **Where they agree:** External services (Redis) are overkill for training
>
> **Where they disagree:** Persistence vs simplicity; teaching value vs minimalism
>
> **Strongest points:**
> - Pragmatist: Simplicity matters for learning
> - Innovator: Real patterns are more valuable than toy examples
> - Devil's Advocate: Don't overcomplicate training
>
> **Final Recommendation:** SQLite via Bun
>
> **Rationale:** Best balance — teaches real patterns (queries, schema) without external dependencies. Bun's native support makes it nearly as simple as in-memory, but students learn transferable skills.
>
> **Implementation Plan:**
> 1. Create `src/db/index.ts` with Bun SQLite setup
> 2. Create sessions table schema
> 3. Add `createSession`, `getSession`, `deleteSession` functions
> 4. Integrate with auth middleware
> 5. Document setup in README

---

## Save the Decision

Update `docs/architecture-decision.md` with the synthesis output. Ask Claude:

```
Update docs/architecture-decision.md with this decision. Include:
- Decision: SQLite via Bun
- Status: Accepted
- Context, options considered, rationale, and implementation plan
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

## Next Lab

Continue to **[Lab 5: Meta Thread](lab-5-meta-thread.md)** to learn how to decompose large work into manageable threads.

---

## Reference (Optional)

The sections below cover deeper techniques, manual multi-session fusion, and automation. Skip if you're ready for Lab 5.

---

## Going Deeper: Manual Multi-Session Fusion

The Virtual Roundtable simulates perspectives in one context. For **high-stakes decisions**, you may want true independence — actual separate sessions or different models.

### When to Use Manual Multi-Session

- Decisions with major consequences (architecture, security, infrastructure)
- When you suspect your framing might bias the response
- When you want to compare Claude vs. Gemini vs. GPT perspectives

### The Process

**Stage 1: Gathering (3 separate sessions)**

Open 3 sessions (Terminal Claude, Web Claude, and/or external models). Paste the same gathering prompt in each:

```
I need your analysis on an architecture decision. Answer independently — don't hedge or say "it depends" without committing to a recommendation.

## Context
[Same context as above]

## Options
[Same options as above]

## Provide:
1. **Recommendation**: Which option and why (one clear choice)
2. **Trade-offs**: What you're giving up
3. **Risks**: What could go wrong
4. **Confidence level**: High / Medium / Low

Be direct. Take a position.
```

**Stage 2: Synthesis (fresh session)**

Open a new session. Paste all 3 responses and ask:

```
I gathered multiple perspectives on an architecture decision. Synthesize them.

## Perspective 1
[Paste response]

## Perspective 2
[Paste response]

## Perspective 3
[Paste response]

## Provide:
1. Where they agree
2. Where they disagree
3. Best ideas from each
4. Final recommendation (ONE choice)
5. Implementation plan
```

This takes 15-20 minutes but provides true model independence.

---

## Variations

### Quick Fusion (5 min)

For simpler decisions, use just 2 perspectives:

```
Analyze this decision from two opposing viewpoints:

**View A:** Argue for the SIMPLEST solution
**View B:** Argue for the most SCALABLE solution

Then synthesize: which is right for THIS specific context?

Decision: [Your question]
```

### Debugging Fusion

For mystery bugs, force multiple hypotheses:

```
I have a bug: [description]

Generate 3 independent hypotheses for the root cause:
- Hypothesis A: [most likely]
- Hypothesis B: [second most likely]
- Hypothesis C: [wild card]

For each, explain the evidence needed to confirm or rule it out.

Then recommend: which hypothesis to test first and how.
```

### Code Review Fusion

For PR reviews, split by concern:

```
Review this code from 3 perspectives:

**Correctness:** Does it do what it claims? Edge cases?
**Security:** Vulnerabilities? Input validation? Auth issues?
**Performance:** Bottlenecks? Unnecessary operations?

Then provide a unified review with prioritized issues.
```

---

## The Power Move: Automated Fusion

The Virtual Roundtable is fast. Manual multi-session is thorough. But imagine this:

```
You: /fusion "Should we use SQLite or PostgreSQL?"

Claude: Spawning 3 perspective agents...
        ✓ Simplicity Advocate: SQLite because...
        ✓ Scale Advocate: PostgreSQL because...
        ✓ Pragmatist: Depends on requirements...

        Synthesizing...

        **Recommendation:** SQLite now, PostgreSQL migration path ready.
```

One command. Three **real parallel agents** (not simulated personas). Synthesized decision. **30 seconds instead of 15 minutes.**

This is different from the Virtual Roundtable — each agent runs in its own context with true independence, then results are automatically collected and synthesized.

**Ready to build this?** In **[Lab 7: Automated Fusion](lab-7-automated-fusion.md)**, you'll create a reusable `/fusion` skill using Claude Code's Task tool. You'll learn:

- **Task tool orchestration** — spawning parallel agents
- **Perspective engineering** — forcing diverse outputs
- **Slash command creation** — building reusable skills

This is where the methodology becomes a superpower.

---

## Success Criteria

Your Fusion Thread succeeded if:

- [ ] You got genuinely different perspectives (not just variations of the same answer)
- [ ] The synthesis identified both agreements AND disagreements
- [ ] Final recommendation is clear and decisive (not wishy-washy)
- [ ] Rationale explains why alternatives were rejected
- [ ] Implementation plan is concrete (not vague)
- [ ] Decision is documented in `architecture-decision.md`

---

## Failure Patterns

### "All perspectives gave the same answer"

**Why:** Persona constraints weren't strong enough.

**Fix:** Make them more extreme: "Expert A MUST argue for the simplest option even if it has downsides."

### "Synthesis was wishy-washy"

**Why:** Didn't demand decisiveness.

**Fix:** Add: "You MUST pick one option. 'It depends' is not acceptable without a concrete recommendation."

### "I'm not sure if I trust simulated perspectives"

**Why:** You might need true independence for high-stakes decisions.

**Fix:** Use the manual multi-session approach (see Reference section) or build the automated version in Lab 7.

---

## Retrospective Questions

- Did the roundtable surface trade-offs you hadn't considered?
- Did forcing the Devil's Advocate perspective help?
- Would you trust this for a real architecture decision?
- What decision would you Fusion Thread next?

---

*Fusion Threads turn gut instincts into informed decisions.*
