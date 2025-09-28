# Copilot / Agent Instructions

## Interaction style:
- Stay concise and to the point unless more detail is requested.
- If extended responses are required, use bullet points or numbered lists for clarity.
- When offering choices to the user, use a numbered list; include option 0 for a short pros/cons summary.

Choice highlighting:
- When recommending or highlighting a default choice, mark it with an arrow and bold the line. Example:

	1. Option A
	2. Option B
  → **3. Option C (recommended)**


## Commit guidelines:

- Always produce suggested commit messages that follow Conventional Commits format: `type(scope?): subject` (e.g., `feat(theme): add live preview`).

- Do NOT run or execute git commit commands automatically.

-- When asked to propose a commit message, return ONLY the final commit message text (no code fences, no explanation) unless the user explicitly requests alternatives. Optionally provide a one-line rationale # 

- Relaxed commit confirmation policy (default):
	- For small changes (few files or <= N lines changed), summarize the changes (file list and brief line counts) and ask a single approval question: "Commit with message: '...'?" Show full diff only if requested.
	- For larger changes or new files, always show the full diff/patch and ask for explicit confirmation before staging/committing.
	- Always confirm whether to push; committing does not automatically push unless explicitly requested.

- If a task requires creating or modifying files and the relaxed policy triggers full review, show the diff/patch and ask for explicit user confirmation before staging or committing.

- If a generated commit message would violate `commitlint`, prefer shorter, lower-case subjects and avoid sentence-case. Prefer subject <= 50 characters where practical.

- When the user asks for a commit to be made on their behalf, explicitly confirm the exact files and commit message, then perform the staged commit. Ask separately before pushing.

Pre-commit checklist (agent must follow before committing):
1. Present a concise summary of changes (or full diff if large).
2. Restate the exact commit message to use.
3. Ask for one of: "commit", "commit+push", or "cancel".

Rationale: Keep human review in the loop and ensure all commits follow repository conventions.
