# Thread Engineering Labs

A hands-on training program for **Thread-Based Engineering** — a methodology for multiplying developer output using Claude Code.

Based on [Boris Cherny's workflow](https://x.com/bcherny/status/2007179832300581177) (creator of Claude Code) and [IndyDevDan's thread taxonomy](https://www.youtube.com/@indydevdan).

---

## What You'll Learn

How to run Claude Code sessions as purposeful "threads" instead of wandering conversations:

| Thread Type | Use Case |
|-------------|----------|
| **Base Thread** | Single focused task (bug fix, small feature) |
| **Parallel Thread** | Multiple independent tasks simultaneously |
| **Chained Thread** | Risky work with human checkpoints |
| **Fusion Thread** | Multiple perspectives → synthesized decision |
| **Meta Thread** | Decompose large work into child threads |
| **Long Thread** | Mechanical grunt work (add types, fix lint) |

Each lab teaches one thread type through hands-on exercises.

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
```

### Verify Your Setup

**Step 1: Start the dev server**
```bash
bun run dev
```

You should see:
```
🧵 Thread Engineering Labs running on port 3000
```

> **Note:** The server keeps running (your terminal won't show a new prompt). This is normal! Press `Ctrl+C` to stop the server when you're ready to continue.

**Step 2: Run the tests**
```bash
bun test
```

You should see **1 failing test** - this is intentional! Lab 1's bug causes a test to fail. You'll fix this in the first lab.

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
| [Lab 4](docs/lab-4-fusion-thread.md) | 20 min | Make an architecture decision using multiple perspectives |
| [Lab 5](docs/lab-5-meta-thread.md) | 30 min | Decompose a large feature into a thread map |
| [Lab 6](docs/lab-6-long-thread.md) | 30 min | Add JSDoc to all utilities via Long Thread |
| [Lab 7](docs/lab-7-automated-fusion.md) | 45 min | Build a `/fusion` skill that automates multi-perspective analysis |

**Total time:** ~4 hours (can be done over multiple sessions)

---

## Verification

Each lab has objective pass/fail verification. Run after completing each lab:

```bash
bun run verify 1  # Verify Lab 1 completion
bun run verify 2  # Verify Lab 2 completion
bun run verify 6  # Verify Lab 6 completion
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
3. **Week 3:** Labs 5-7 (Meta, Long, Automated Fusion) + team retro

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
