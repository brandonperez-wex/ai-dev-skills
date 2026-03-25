---
name: plan
description: Lightweight iterative planning — discover constraints through conversation, define verticals with done criteria and test contracts. Use before build for any non-trivial feature, or let design invoke it.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - WebSearch
  - WebFetch
  - Skill
argument-hint: "[topic or path/to/existing-plan.md]"
---

# Plan

Discover what matters through conversation, write it down as constraints + verticals, start building. Planning a medium feature should take 10-15 minutes, not hours.

<HARD-GATE>
Read the codebase before planning. Never plan against an imagined architecture.
</HARD-GATE>

## When to Use

- Before building any non-trivial feature
- When invoked by the design skill
- When aligning with a teammate on approach before coding

**Skip planning** if the change is a single-sentence fix with obvious scope — just build it.

## Process

### 1. Ground in Reality (2 min)

Read the relevant parts of the codebase:
- Project structure, tech stack, existing patterns
- Files that will likely be touched
- Existing tests for style and conventions

Don't read everything. Read what matters for this feature.

### 2. Understand What We're Building (2-3 min)

Ask the user what they're building and why. Propose your understanding, let them correct it — don't interrogate with a checklist.

Summarize back in 2-3 sentences:
> "So we're building X to solve Y. The main risk is Z."

Get confirmation before continuing.

### 3. Discover Constraints (5-10 min, iterative)

This is where the value lives. Surface architectural decisions as proposals, not open-ended questions:

> "For auth, QuickBooks requires OAuth 2.0 — no API key option. I'll use their Node SDK for the token flow. Sound right?"

Each confirmed decision becomes a constraint line in the plan. Keep going until you've covered the decisions that matter for **this** feature:

- **Transport & protocol** — HTTP, gRPC, stdio, SSE?
- **Framework & patterns** — what matches existing codebase?
- **Auth & security** — how does this authenticate?
- **Data** — what schemas, storage, external APIs?
- **Scope boundaries** — what's in, what's explicitly out?

Skip categories that are obvious for this feature. Spend time on decisions where a wrong default wastes hours of build time.

Present constraints in groups of 2-3. Confirm each group before moving to the next.

When confirmed, record as a constraint:
- **Auth: QuickBooks OAuth 2.0 via Node SDK** — no API key option available

If a constraint involves component boundaries, data flow between services, or API contract design, invoke the **architecture** skill for that specific question.

If there's a UI component, invoke **ui-ux-design** for the visual direction.

### 4. Slice into Verticals (2-5 min)

Break the work into ordered verticals. Each vertical has:
- **Does** — what it accomplishes (one sentence)
- **Done when** — the observable outcome that proves it works
- **Test** — the integration test assertion that verifies it
- **Skills** — (optional) skills to inject into the build context for this vertical
- **Deps** — which other verticals must be complete first

**Vertical 0 is always the walking skeleton** — thinnest end-to-end path proving the infrastructure works.

**Detail the first 2-3 verticals fully.** Later verticals stay as headlines — they get detailed when you're closer to building them. This is the hierarchical breakdown: broad picture first, detail progressively.

Example:
```markdown
### V1: Customer list
- **Does:** `qb customers list` returns paginated customer list
- **Done when:** Command returns formatted customer records with name, email, balance
- **Test:** Integration test hits sandbox API, asserts array with required fields
- **Skills:** rust-quality
- **Deps:** V0 (auth + config established)
```

The "done when" + "test" lines ARE the test contract — write them as concrete assertions, specific enough that build can translate directly into test code without ambiguity.

### 4b. Suggest Build Skills

After defining verticals, suggest which skills the build phase will need. Check:
- **Language/runtime** — is there a language-specific quality skill? (e.g., `rust-quality`)
- **Domain** — does this touch agent/MCP patterns? (`ai-agent-building`)
- **Infrastructure** — does this project lack CI/linting? (`boilerplate-cicd`)
- **Available skills** — scan `~/.claude/skills/` for relevant matches

Present suggestions to the user: "For this Rust project, I'd inject `rust-quality` and `coding-standards` into each vertical's build context. Want to add or change any?"

The user confirms. Record confirmed skills in each vertical's `Skills` field or as a plan-level default.

### 5. Save the Plan

Save to `specs/NNN-<topic>/plan.md` (or update an existing plan).

**Spec directory protocol:**
- Directory: `specs/` at project root (`mkdir -p specs` if needed)
- Find highest existing `NNN-*` prefix, increment by 1. Start at `001` if empty.
- All artifacts for this feature go in the same directory.

Get today's date for the plan header: !`date +%Y-%m-%d`

### 6. Review (optional)

If the user wants teammate review before building:
- Invoke **commit-and-pr** to push and create a PR
- Wait for review before building

If solo or time-pressured: skip to build.

### 7. Hand Off to Build

When the first verticals have done criteria + test contracts:
- Tell the user which verticals are ready
- Suggest starting build on V0/V1 while later verticals get detailed
- Invoke **build** with the plan path, or let the user start a separate session

**You don't need the whole plan finished to start building.** Ready verticals go to build while you continue detailing later ones.

## Plan Format

```markdown
# Plan: [Feature Name]

> Date: YYYY-MM-DD
> Status: [planning | building | complete]

## What & Why
[2-3 sentences: what are we building and why]

## Constraints
- [Decision: rationale]
- [Decision: rationale]
- ...

## Non-Goals
- [What this explicitly does NOT do]

## Build Skills (default for all verticals)
- [skill-name — why it's needed]

## Verticals

### V0: Walking skeleton
- **Does:** [thinnest end-to-end path]
- **Done when:** [observable outcome]
- **Test:** [integration test assertion]
- **Deps:** None

### V1: [Name]
- **Does:** [one sentence]
- **Done when:** [observable outcome]
- **Test:** [integration test assertion]
- **Deps:** [V0, etc.]

### V2: [Name]
- **Does:** [one sentence]
- **Done when:** [observable outcome]
- **Test:** [integration test assertion]
- **Deps:** [V0, V1, etc.]

### V3: [Name] (headline — detail later)
### V4: [Name] (headline — detail later)

## Open Questions
- [Anything unresolved that might affect later verticals]
```

## Scaling

| Feature Size | Constraints | Verticals | Planning Time |
|---|---|---|---|
| **Small** (single endpoint, CLI command) | 3-5 bullets | 2-3 | 5 min |
| **Medium** (multi-endpoint feature, integration) | 5-10 bullets | 3-6 | 10-15 min |
| **Large** (new system, multi-service) | 10-15 bullets | 6-12, headlines for later ones | 15-20 min |

If planning takes more than 20 minutes, the feature is too big — split it.

## Anti-Patterns

| Anti-Pattern | Fix |
|---|---|
| **Writing prose specs** | Constraints are bullets, not paragraphs |
| **Detailing every vertical upfront** | Only detail the next 2-3. Headlines for the rest. |
| **Planning without reading code** | Hard gate: read the codebase first |
| **Skipping non-goals** | Non-goals prevent scope creep. Always include them. |
| **Separate business and technical specs** | One plan document. Constraints cover both. |
| **Template-filling** | Skip sections that don't apply to this feature |
| **Planning for more than 20 minutes** | Feature is too big (split) or you're over-specifying |

Follow the communication-protocol skill for all user-facing output and interaction.

## Guidelines

- **Constraints prevent wrong turns.** This is where planning time pays off — not prose descriptions.
- **The plan is a thinking tool for the human.** Keep it readable and concise.
