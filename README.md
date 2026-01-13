# Thread Engineering Labs

A hands-on training program for **Thread-Based Engineering** — a methodology for multiplying developer output using Claude Code.

Based on [Boris Cherny's workflow](https://x.com/bcherny/status/2007179832300581177) (creator of Claude Code) and [IndyDevDan's thread taxonomy](https://www.youtube.com/@indydevdan).

---

## What You'll Learn

How to run Claude Code sessions as purposeful "threads" instead of wandering conversations:

| Thread Type | Use Case | Lab |
|-------------|----------|-----|
| **Base Thread** | Single focused task (bug fix, small feature) | Lab 1 |
| **Parallel Thread** | Multiple independent tasks simultaneously | Lab 2 |
| **Chained Thread** | Risky work with human checkpoints | Lab 3 |
| **Fusion Thread** | Multiple perspectives → synthesized decision | Lab 4 |
| **Meta Thread** | Decompose large work into child threads | Lab 5 |
| **Long Thread** | Mechanical grunt work (add types, fix lint) | Lab 6 |

Each lab takes ~30 minutes and uses this codebase for hands-on exercises.

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed
- Git configured

### Setup

```bash
# Clone the repo
git clone https://github.com/chadmbrown/thread-engineering-labs.git
cd thread-engineering-labs

# Install dependencies
bun install

# Verify setup
bun run dev          # Start server (should work)
bun test             # Run tests (Lab 1 test will fail - this is intentional)
```

### Start Training

```bash
# Read the introduction
cat docs/lab-0-introduction.md

# Or open in your editor
code docs/lab-0-introduction.md
```

---

## Lab Overview

| Lab | Time | What You'll Do |
|-----|------|----------------|
| [Lab 0](docs/lab-0-introduction.md) | 15 min | Environment setup, core concepts |
| [Lab 1](docs/lab-1-base-thread.md) | 30 min | Fix a null check bug using Base Thread pattern |
| [Lab 2](docs/lab-2-parallel-thread.md) | 30 min | Complete docs + tests in parallel lanes |
| [Lab 3](docs/lab-3-chained-thread.md) | 30 min | Add token expiration with phased checkpoints |
| [Lab 4](docs/lab-4-fusion-thread.md) | 45 min | Make an architecture decision using multiple perspectives |
| [Lab 5](docs/lab-5-meta-thread.md) | 30 min | Decompose a large feature into a thread map |
| [Lab 6](docs/lab-6-long-thread.md) | 30 min | Add JSDoc to all utilities via Long Thread |

**Total time:** ~3.5 hours (can be done over multiple sessions)

---

## Verification

Each lab has objective pass/fail verification:

```bash
bun run verify 1  # Verify Lab 1 completion
bun run verify 2  # Verify Lab 2 completion
# ...
bun run verify all  # Verify all labs
```

---

## Tech Stack

This training repo uses:

- **Runtime:** Bun
- **Language:** TypeScript
- **Framework:** Hono
- **Linting/Formatting:** Biome
- **Testing:** Bun test

These choices align with Boris Cherny's publicly shared workflow.

---

## For Teams

If you're using this for team training:

1. **Week 1:** Labs 0-2 (Base, Parallel)
2. **Week 2:** Labs 3-4 (Chained, Fusion)
3. **Week 3:** Labs 5-6 (Meta, Long) + team retro

Consider having team members share their experiences after each lab.

---

## Contributing

Found an issue? Have a suggestion?

- **Bug reports:** Open an issue
- **Lab feedback:** Use the [Lab Feedback](https://github.com/chadmbrown/thread-engineering-labs/discussions/categories/lab-feedback) discussion
- **Completions:** Share your completion in [Completions](https://github.com/chadmbrown/thread-engineering-labs/discussions/categories/completions)

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Attribution

- **Boris Cherny** — Claude Code creator, workflow patterns ([thread](https://x.com/bcherny/status/2007179832300581177))
- **IndyDevDan** — Thread taxonomy naming ([YouTube](https://www.youtube.com/@indydevdan))
- **Anthropic** — Claude Code documentation

---

## License

MIT — see [LICENSE](LICENSE)

---

## Questions?

Open a [Discussion](https://github.com/chadmbrown/thread-engineering-labs/discussions) or reach out on X/Twitter.

---

*Ship more. Steer less. Thread everything.*
