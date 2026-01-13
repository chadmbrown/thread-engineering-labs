# Architecture Decision: Session Storage

## Context

We need to add user session management to the Thread Engineering Labs API. This decision will affect how we handle authenticated users, session invalidation, and scaling.

## Options

### 1. In-memory store (Map in the app)

Store sessions in a JavaScript `Map` within the application process.

**Pros:**
- Zero external dependencies
- Simple to implement
- Fast access

**Cons:**
- Lost on server restart
- Cannot scale horizontally
- Memory limits

### 2. Redis (external service)

Use Redis as an external session store.

**Pros:**
- Persistent across restarts
- Scales horizontally
- Battle-tested for sessions
- TTL support built-in

**Cons:**
- External dependency
- Requires Redis knowledge
- Network latency

### 3. SQLite (file-based, via Bun)

Use SQLite with Bun's native SQLite support.

**Pros:**
- Persistent
- No external services
- Bun has native support
- SQL queries for analytics

**Cons:**
- File I/O overhead
- Harder to scale horizontally
- Need to manage cleanup

### 4. JWT-only (stateless, no server storage)

Use JWTs with all session data encoded in the token.

**Pros:**
- Truly stateless
- No storage needed
- Scales infinitely

**Cons:**
- Cannot invalidate individual sessions
- Token size grows with data
- Refresh token complexity

## Constraints

- Labs should work without external dependencies (Redis is optional)
- Must support session invalidation (for security)
- Should be simple enough for training purposes
- Prefer solutions that work with `bun run dev` out of the box

## Decision

[Use Lab 4: Fusion Thread to analyze this decision from multiple perspectives and document your recommendation here]

## Rationale

[Document the reasoning behind your decision]

## Consequences

[What are the implications of this decision?]
