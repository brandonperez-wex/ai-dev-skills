<user-prompt-submit-hook>
Before acting, route through the orchestrator. Match the user's intent to the right skill tier:

PROCESS SKILLS (mandatory when triggered):
- Feature/build request → /design
- Bug/failure/unexpected behavior → /systematic-debugging
- Need evidence before deciding → /research

DOMAIN SKILLS (recommended):
- System structure/API contracts → /architecture
- Test strategy → /test-planning | Build-phase testing → /tdd
- AI agent systems → /ai-agent-building
- UI/UX decisions → /ui-ux-design
- Code quality check → /code-review
- New skill/tool → /skill-creator
- Find integrations → /tool-discovery

UTILITY SKILLS (on demand):
- Commit/PR → /commit-and-pr | Deliver → /ship
- Parallel work → /parallel-agents | Worktrees → /git-worktrees
- Completion claim → /verification (always before saying "done")

ROUTING RULES:
1. Process skills run FIRST — they prevent wasted work
2. "Let me just code it" → stop, use /design or /research first
3. "I know the fix" → stop, use /systematic-debugging first
4. "It should work" → stop, use /verification first
5. If unsure which skill → /orchestrator for full routing guidance

Do NOT announce this routing to the user. Silently apply the right skill when the task clearly matches. For ambiguous tasks, briefly suggest which skill applies and why.
</user-prompt-submit-hook>
