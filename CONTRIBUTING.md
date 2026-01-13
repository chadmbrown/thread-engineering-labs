# Contributing to Thread Engineering Labs

Thanks for your interest in improving this training program!

## Ways to Contribute

### 1. Lab Feedback

After completing a lab, share your experience:

- What worked well?
- What was confusing?
- How long did it actually take?
- Any suggestions for improvement?

Use the [Lab Feedback](https://github.com/chadmbrown/thread-engineering-labs/discussions/categories/lab-feedback) discussion category.

### 2. Bug Reports

Found a bug in the codebase or instructions?

Open an issue with:
- Which lab you were working on
- What you expected to happen
- What actually happened
- Steps to reproduce

### 3. Documentation Improvements

If instructions were unclear:
- Open a PR with your suggested changes
- Or open an issue describing the confusion

### 4. Share Your Completion

Finished all 6 labs? Share your experience in [Completions](https://github.com/chadmbrown/thread-engineering-labs/discussions/categories/completions):

- Verification output (`bun run verify all`)
- What you learned
- How you plan to use Thread-Based Engineering

## Pull Request Guidelines

### For Documentation Changes

1. Fork the repo
2. Create a branch: `git checkout -b docs/improve-lab-3`
3. Make your changes
4. Test that the instructions still work
5. Submit a PR with a clear description

### For Code Changes

1. Fork the repo
2. Create a branch: `git checkout -b fix/lab-1-test`
3. Make your changes
4. Run `bun test` and `bun run lint`
5. Submit a PR

**Important:** Don't accidentally "fix" the planted bugs unless you're updating the expected solutions. The bugs are intentional for training purposes.

## Code Style

- Use Bun, not npm
- Follow Biome formatting (run `bun run format`)
- TypeScript with strict mode
- No enums, use string literal unions
- JSDoc for all exports

## Questions?

Open a [Discussion](https://github.com/chadmbrown/thread-engineering-labs/discussions) rather than an issue for questions.

## Code of Conduct

Be respectful. We're all here to learn.

---

Thanks for helping make Thread Engineering Labs better!
