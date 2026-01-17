# Thread Engineering Labs - Session Progress

**Last Updated:** January 13, 2025
**Status:** User testing in progress

---

## What We Built

A public, open-source training program for **Thread-Based Engineering** — a methodology for multiplying developer output using Claude Code.

### Tech Stack
- **Runtime:** Bun
- **Language:** TypeScript
- **Framework:** Hono
- **Linting:** Biome
- **Testing:** Bun test

### Repository Structure
```
thread-engineering-labs/
├── src/
│   ├── index.ts                    # Hono app entry point
│   ├── routes/users.ts             # Lab 1: Null check bug
│   ├── middleware/auth.ts          # Lab 3: Missing expiration check
│   ├── services/
│   │   ├── email.ts                # Lab 2: No tests exist
│   │   └── notifications.ts
│   ├── utils/
│   │   ├── validators.ts           # Lab 6: No JSDoc
│   │   ├── formatters.ts           # Lab 6: No JSDoc
│   │   └── parsers.ts              # Lab 6: No JSDoc
│   └── types/index.ts
├── tests/
│   ├── routes/users.test.ts        # Lab 1 test FAILS initially
│   ├── middleware/auth.test.ts
│   └── utils/validators.test.ts
├── docs/
│   ├── lab-0-introduction.md
│   ├── lab-1-base-thread.md
│   ├── lab-2-parallel-thread.md
│   ├── lab-3-chained-thread.md
│   ├── lab-4-fusion-thread.md
│   ├── lab-5-meta-thread.md
│   ├── lab-6-long-thread.md
│   ├── README.md                   # Lab 2: Incomplete (TODOs)
│   ├── architecture-decision.md    # Lab 4: Needs decision
│   └── feature-notification-preferences.md  # Lab 5: Needs decomposition
├── scripts/
│   └── verify-lab.ts               # Verification script
├── .claude/settings.json
├── CLAUDE.md
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── tsconfig.json
└── biome.json
```

### 6 Labs with Planted Issues

| Lab | Thread Type | Location | Planted Issue |
|-----|-------------|----------|---------------|
| 1 | Base Thread | `src/routes/users.ts` | Null check bug in `getUserPreferences` |
| 2 | Parallel Thread | `docs/README.md` + `src/services/email.ts` | Incomplete docs + missing tests |
| 3 | Chained Thread | `src/middleware/auth.ts` | No token expiration check |
| 4 | Fusion Thread | `docs/architecture-decision.md` | Architecture decision placeholder |
| 5 | Meta Thread | `docs/feature-notification-preferences.md` | Feature needs decomposition |
| 6 | Long Thread | `src/utils/*.ts` | Missing JSDoc (19 functions) |

---

## Key URLs

- **GitHub Repo:** https://github.com/chadmbrown/thread-engineering-labs
- **Discussions:** https://github.com/chadmbrown/thread-engineering-labs/discussions

---

## Local Directories

| Path | Purpose |
|------|---------|
| `~/projects/thread-engineering-labs-dev` | Development version (your working copy) |
| `~/projects/thread-engineering-labs` | Fresh clone for testing (student perspective) |

---

## Completed Steps

- [x] Initialize Bun/Hono/TypeScript project
- [x] Create all source files with planted bugs
- [x] Create tests (Lab 1 test fails intentionally)
- [x] Create verification script (`bun run verify <1-6|all>`)
- [x] Update LICENSE with "Chad Brown"
- [x] Update README.md with GitHub username `chadmbrown`
- [x] Update CONTRIBUTING.md with GitHub username
- [x] Remove internal files (HANDOFF.md, .zip)
- [x] Create .gitignore
- [x] Initialize git repo
- [x] Push to GitHub (initial commit)
- [x] Make repo public
- [x] Enable GitHub Discussions
- [x] Create discussion categories:
  - 📣 Announcements (announcement format)
  - 🎉 Completions (open-ended)
  - 💡 Lab Feedback (open-ended)
  - 🙏 Q&A (question/answer format)

---

## In Progress

- [ ] **User testing** - Chad going through all 6 labs from fresh clone
  - Testing from student perspective (fresh `git clone`)
  - Noting any issues, confusing instructions, or bugs
  - Will fix issues in `-dev` directory and push updates

---

## Remaining Steps

- [ ] Complete user testing of all labs
- [ ] Fix any issues discovered during testing
- [ ] Push fixes to GitHub
- [ ] Share publicly on X/LinkedIn
- [ ] (Optional) Tag Boris Cherny / IndyDevDan

---

## Useful Commands

```bash
# In the test directory (student perspective)
cd ~/projects/thread-engineering-labs
bun install
bun run dev              # Start server on port 3000
bun test                 # Run tests (Lab 1 should fail)
bun run verify all       # Check all labs (all should fail initially)
bun run verify 1         # Check specific lab

# In the dev directory (for making fixes)
cd ~/projects/thread-engineering-labs-dev
# Make edits, then:
git add . && git commit -m "Fix: description" && git push
```

---

## Discussion Categories Setup

| Category | Format | Description |
|----------|--------|-------------|
| Announcements | Announcement | Updates from maintainers (only you can post) |
| Completions | Open-ended | "I finished!" - share success and findings |
| Lab Feedback | Open-ended | Suggestions for improving labs |
| Q&A | Question/Answer | Ask the community for help (answers enabled) |

---

## Attribution

- **Boris Cherny** — Claude Code creator, workflow patterns
- **IndyDevDan** — Thread taxonomy naming
- **Anthropic** — Claude Code documentation

---

## Notes

- Bun is installed at `~/.bun/bin/bun`
- If `bun` command not found, use full path or run `source ~/.zshrc`
- The verification script uses `process.execPath` to find bun automatically

---

## Resume Instructions

If starting a new Claude Code session:

1. Read this file first: `cat ~/projects/thread-engineering-labs-dev/SESSION-PROGRESS.md`
2. Check current status of user testing
3. Continue from "In Progress" section above
