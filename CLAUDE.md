# Thread Engineering Labs

Training repository for Thread-Based Engineering methodology with Claude Code.

## Development Workflow

**Always use `bun`, not `npm`.**

```bash
# 1. Make changes

# 2. Typecheck (fast feedback)
bun run typecheck

# 3. Run tests
bun test                          # All tests
bun test tests/routes             # Specific directory
bun test --watch                  # Watch mode

# 4. Lint before committing
bun run lint                      # Check for issues
bun run format                    # Auto-fix formatting

# 5. Before creating PR
bun run lint && bun test
```

## Code Style

- **Never use `enum`** — prefer string literal unions
- **Use `type` over `interface`** for object types
- **Prefer early returns** over nested conditionals
- **All exports should have JSDoc** (except in `src/utils/` before Lab 6)

Example:
```typescript
// ❌ Bad
enum Status { Active, Inactive }
interface User { name: string }

// ✅ Good
type Status = 'active' | 'inactive';
type User = { name: string };
```

## Project-Specific Notes

⚠️ **This is a training repo with intentionally planted issues.**

| Lab | Location | Issue |
|-----|----------|-------|
| Lab 1 | `src/routes/users.ts` | Null check bug |
| Lab 2 | `docs/README.md` + `src/services/email.ts` | Incomplete docs + missing tests |
| Lab 3 | `src/middleware/auth.ts` | No token expiration check |
| Lab 4 | `docs/architecture-decision.md` | Needs decision |
| Lab 5 | `docs/feature-notification-preferences.md` | Needs decomposition |
| Lab 6 | `src/utils/*.ts` | Missing JSDoc |

**Do NOT fix these issues unless you are actively working on that specific lab.**

## Available Commands

```bash
bun run dev           # Start development server
bun run build         # Build for production
bun test              # Run all tests
bun run typecheck     # TypeScript type checking
bun run lint          # Lint with Biome
bun run format        # Format with Biome
bun run verify <n>    # Verify lab N completion (1-6)
```

## Lab Verification

After completing each lab, verify your work:

```bash
bun run verify 1  # Check Lab 1: Base Thread
bun run verify 2  # Check Lab 2: Parallel Thread
bun run verify 3  # Check Lab 3: Chained Thread
bun run verify 4  # Check Lab 4: Fusion Thread
bun run verify 5  # Check Lab 5: Meta Thread
bun run verify 6  # Check Lab 6: Long Thread
```

## Testing Patterns

```bash
# Run specific test file
bun test tests/routes/users.test.ts

# Run tests matching pattern
bun test --grep "should handle"

# Run with coverage
bun test --coverage
```

## Git Workflow

Branch naming convention for labs:
```bash
git checkout -b thread/base/lab-1-fix-null-check
git checkout -b thread/parallel/lab-2-docs-and-tests
git checkout -b thread/chained/lab-3-auth-expiration
git checkout -b thread/long/lab-6-add-jsdoc
```

## Error Patterns to Avoid

| Pattern | Problem | Fix |
|---------|---------|-----|
| `user.preferences.theme` | Missing null check | Add `user?.preferences?.theme` or explicit check |
| `new Date(exp)` | Wrong unit | Token exp is seconds, not milliseconds: `exp * 1000` |
| `throw new Error` in middleware | Uncaught | Use `return c.json({ error }, status)` |

## Resources

- [Lab 0: Introduction](docs/lab-0-introduction.md)
- [Lab 1: Base Thread](docs/lab-1-base-thread.md)
- [Lab 2: Parallel Thread](docs/lab-2-parallel-thread.md)
- [Lab 3: Chained Thread](docs/lab-3-chained-thread.md)
- [Lab 4: Fusion Thread](docs/lab-4-fusion-thread.md)
- [Lab 5: Meta Thread](docs/lab-5-meta-thread.md)
- [Lab 6: Long Thread](docs/lab-6-long-thread.md)
- [Lab 7: Automated Fusion](docs/lab-7-automated-fusion.md)
