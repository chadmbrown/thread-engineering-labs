# Bonus Lab: Automated Fusion

**Time:** 45 minutes
**Difficulty:** Advanced
**Prerequisites:** Lab 4 (Fusion Thread), Lab 6 (Long Thread)

---

## What You'll Build

A `/fusion` slash command that automates the entire Fusion Thread workflow:

```
You: /fusion "Should we use SQLite or PostgreSQL for this project?"

Claude: Spawning 3 perspective agents...

[Agent 1 - Simplicity Advocate]: SQLite because...
[Agent 2 - Scale Advocate]: PostgreSQL because...
[Agent 3 - Pragmatist]: Consider the actual requirements...

Synthesizing perspectives...

**Recommendation:** SQLite for now, with migration path to PostgreSQL.
**Rationale:** [Merged insights from all three perspectives]
**Confidence:** High
```

One command. Multiple perspectives. Synthesized answer.

---

## Why Automate Fusion?

The manual Fusion Thread (Lab 4) works, but requires:
- Opening 3+ terminal/browser sessions
- Copy-pasting the same prompt
- Waiting and collecting responses
- Copy-pasting into a synthesis session

That's 10-15 minutes of coordination overhead per decision.

The automated version:
- Single command entry point
- Parallel execution (faster)
- Automatic collection and synthesis
- Reusable for any decision

---

## How It Works

```
┌─────────────────────────────────────┐
│         /fusion command             │
│   "Which database should we use?"   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Orchestrator (Claude)          │
│  Spawns 3 Task agents in parallel   │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Agent 1 │ │ Agent 2 │ │ Agent 3 │
   │Simplify │ │ Scale   │ │Pragtic  │
   └────┬────┘ └────┬────┘ └────┬────┘
        │         │         │
        └─────────┼─────────┘
                  ▼
┌─────────────────────────────────────┐
│         Synthesis Phase             │
│  Merge perspectives into decision   │
└─────────────────────────────────────┘
```

The key insight: Claude Code's **Task tool** can spawn multiple agents that run in parallel. Each agent has its own context and returns a response. We collect all responses and synthesize.

---

## The Three Perspectives

To get diverse responses from the same model, we assign different "lenses":

| Perspective | Lens | Prompt Modifier |
|-------------|------|-----------------|
| **Simplicity Advocate** | Minimize complexity | "Argue for the simplest solution that could work" |
| **Scale Advocate** | Future-proof | "Argue for the most scalable, production-ready solution" |
| **Pragmatist** | Balance trade-offs | "Analyze trade-offs and recommend based on actual requirements" |

These competing viewpoints force different reasoning paths, even from the same model.

---

## Setup

### 1. Create your branch

```bash
git checkout -b thread/bonus/automated-fusion
```

### 2. Create the commands directory

```bash
mkdir -p .claude/commands
```

### 3. Start Claude Code

```bash
claude
```

---

## Building the Skill

### Step 1: Create the Slash Command

Create `.claude/commands/fusion.md`:

```markdown
---
description: Run automated fusion analysis with multiple perspectives
---

# Automated Fusion Analysis

You are orchestrating a Fusion Thread — gathering multiple perspectives on a decision and synthesizing them into a recommendation.

## The Question
$ARGUMENTS

## Your Process

### Phase 1: Spawn Perspective Agents

Launch exactly 3 Task agents IN PARALLEL (in a single message with multiple tool calls). Each agent should analyze the question from a different perspective:

**Agent 1 - Simplicity Advocate:**
- Prompt: "Analyze this decision and argue for the SIMPLEST solution that could work. Question: [THE QUESTION]. Focus on: minimal dependencies, ease of understanding, fast implementation. Provide a clear recommendation with rationale."

**Agent 2 - Scale Advocate:**
- Prompt: "Analyze this decision and argue for the most SCALABLE, production-ready solution. Question: [THE QUESTION]. Focus on: future growth, maintainability, industry best practices. Provide a clear recommendation with rationale."

**Agent 3 - Pragmatist:**
- Prompt: "Analyze this decision by weighing ALL trade-offs objectively. Question: [THE QUESTION]. Consider: current constraints, team capabilities, timeline, actual requirements. Provide a balanced recommendation."

Use subagent_type: "general-purpose" for all three agents.

### Phase 2: Collect Responses

Wait for all 3 agents to complete. Note their recommendations.

### Phase 3: Synthesize

After receiving all perspectives, provide a synthesis:

1. **Where they agree:** Common ground across perspectives
2. **Where they disagree:** Key points of contention
3. **Merged recommendation:** ONE clear choice that incorporates the best insights
4. **Rationale:** Why this recommendation balances the perspectives
5. **Confidence:** High / Medium / Low based on consensus level
6. **Action items:** Concrete next steps (2-4 items)

## Output Format

```
## Fusion Analysis: [Question Summary]

### Perspective 1: Simplicity Advocate
[Summary of Agent 1's recommendation]

### Perspective 2: Scale Advocate
[Summary of Agent 2's recommendation]

### Perspective 3: Pragmatist
[Summary of Agent 3's recommendation]

---

### Synthesis

**Agreement:** [What all perspectives agreed on]

**Disagreement:** [Key tensions between perspectives]

**Recommendation:** [Your synthesized recommendation]

**Rationale:** [Why this is the best path forward]

**Confidence:** [High/Medium/Low]

**Next Steps:**
1. [Action item]
2. [Action item]
3. [Action item]
```

Begin by spawning the three perspective agents in parallel.
```

---

## Test Your Skill

### Test 1: Technical Decision

```
/fusion Should we use REST or GraphQL for our new API?
```

Expected: Three perspectives analyzing REST vs GraphQL, followed by a synthesized recommendation.

### Test 2: Architecture Decision

```
/fusion Should we use a monorepo or separate repositories for our microservices?
```

### Test 3: Process Decision

```
/fusion Should we adopt trunk-based development or keep feature branches?
```

---

## Walkthrough

### What You Should See

After running `/fusion "Should we use SQLite or PostgreSQL?"`:

**Phase 1:** Claude spawns 3 Task agents:
> Spawning perspective agents in parallel...
>
> - Agent 1 (Simplicity): Analyzing...
> - Agent 2 (Scale): Analyzing...
> - Agent 3 (Pragmatist): Analyzing...

**Phase 2:** Agents complete (usually 10-30 seconds):
> All perspectives collected.

**Phase 3:** Synthesis:
> ## Fusion Analysis: SQLite vs PostgreSQL
>
> ### Perspective 1: Simplicity Advocate
> SQLite. Zero configuration, single file, built into most languages...
>
> ### Perspective 2: Scale Advocate
> PostgreSQL. Concurrent connections, full SQL support, production-proven...
>
> ### Perspective 3: Pragmatist
> Depends on requirements. For <100 users, SQLite. For growth potential, PostgreSQL...
>
> ---
>
> ### Synthesis
>
> **Agreement:** Both are solid choices; decision hinges on scale expectations
>
> **Disagreement:** When to prioritize simplicity vs. future-proofing
>
> **Recommendation:** SQLite for development and early production, with PostgreSQL migration path documented
>
> **Rationale:** Start simple, but don't paint yourself into a corner...
>
> **Confidence:** High
>
> **Next Steps:**
> 1. Use SQLite with an ORM that supports both databases
> 2. Document data model for future migration
> 3. Set trigger criteria for PostgreSQL migration (e.g., >50 concurrent users)

---

## Verify Your Skill Works

Run these checks:

```bash
# 1. Skill file exists
cat .claude/commands/fusion.md

# 2. Test the skill
claude
# Then run: /fusion "Should we use TypeScript or JavaScript for this project?"

# 3. Verify you got 3 perspectives + synthesis
```

**Success criteria:**
- [ ] `/fusion` command is recognized
- [ ] 3 perspective agents spawn in parallel
- [ ] Each perspective returns a distinct recommendation
- [ ] Synthesis merges insights into one recommendation
- [ ] Output follows the expected format

---

## Troubleshooting

### "Agents aren't running in parallel"

**Why:** Task tool calls might be sequential.

**Fix:** The prompt specifies "IN PARALLEL (in a single message with multiple tool calls)" — if Claude still runs them sequentially, add: "You MUST spawn all 3 agents in the same response using multiple Task tool calls."

### "All perspectives give the same answer"

**Why:** The prompt modifiers aren't strong enough.

**Fix:** Make perspectives more extreme:
- Simplicity: "You MUST argue for the simpler option even if it has downsides"
- Scale: "You MUST argue for the more scalable option even if it's overkill"

### "Synthesis is just picking one perspective"

**Why:** Synthesis prompt isn't requiring true merge.

**Fix:** Add to synthesis instructions: "Your recommendation MUST incorporate at least one insight from each perspective. Do not simply pick a winner."

---

## Variations

### Two-Perspective Quick Fusion

For faster, simpler decisions:

```markdown
Launch 2 agents:
- Agent 1: "Argue FOR this approach"
- Agent 2: "Argue AGAINST this approach"
```

### Domain-Specific Perspectives

Customize for your domain:

**For security decisions:**
- Security Advocate
- Developer Experience Advocate
- Pragmatist

**For UI decisions:**
- User Advocate
- Developer Advocate
- Business Advocate

### Multi-Model Fusion (Advanced)

For true model diversity, add WebFetch calls to external APIs:

```markdown
- Agent 1: Claude (via Task tool)
- Agent 2: Gemini (via API call)
- Agent 3: GPT-4 (via API call)
```

This requires API keys and additional setup but provides genuine perspective diversity.

---

## What You've Learned

- **Task tool orchestration:** Spawning parallel agents for concurrent work
- **Perspective engineering:** Getting diverse outputs from the same model
- **Slash command creation:** Building reusable skills in `.claude/commands/`
- **Synthesis patterns:** Merging multiple analyses into actionable recommendations

---

## Taking It Further

Ideas for extending your `/fusion` skill:

1. **Add codebase context:** Have agents read relevant files before analyzing
2. **Save decisions:** Log fusion outputs to a `decisions/` directory
3. **Custom perspectives:** Accept perspective names as arguments
4. **Confidence thresholds:** Auto-flag low-confidence decisions for human review

---

## Commit Your Skill

```bash
git add .claude/commands/fusion.md
git commit -m "feat: add /fusion skill for automated multi-perspective analysis"
```

---

*Automated Fusion turns a 15-minute manual process into a 30-second command.*
