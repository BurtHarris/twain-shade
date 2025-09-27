## Contributing guide

This repository follows a simple, developer-friendly workflow and enforces commit message conventions using Husky + Commitlint.

Quick workflow
- Work on a feature or fix locally on a topic branch (branch from `main` or the appropriate release branch).
- Make small, focused commits that follow the Conventional Commits format. Husky will block commits that don't match the rules.
- Open a PR from your feature branch when ready for review.

Commit message rules
- Use Conventional Commits (type(scope): subject)
  - Example: `feat(theme): add palette editor` or `fix(build): correct script path`
- Keep the subject short and imperative.
- Include a body if additional context is necessary.

Local checks and hooks
- Husky is installed and configured; a commit-msg hook runs `commitlint` to validate messages.
- If a commit is blocked, fix the message (or use `git commit --no-verify` to bypass, only when necessary).
- You can run commitlint locally against a message file:
  ```powershell
  # Validate a temporary message
  echo "feat: my message" > .\tmp-msg.txt
  npx --no -- commitlint --edit .\tmp-msg.txt
  Remove-Item .\tmp-msg.txt
  ```

Using repo-local scripts
- This project includes repo-local utilities under `.specify/scripts/powershell/` for working with specs and plans.
- Those scripts often support machine-friendly modes (for CI) — check the script help for `-Json` or `-RequireTasks` flags.

Spec kit (repo-local `.specify` scripts)
- Create a new feature scaffold with the repo-local `create-new-feature.ps1` script:
  - Example (interactive):
    ```powershell
    .\.specify\scripts\powershell\create-new-feature.ps1 "Add palette editor"
    ```
  - The script will create a new `specs/` entry, copy the spec template, and (when the repo is a git repo) create a new branch for the feature. Use the `-Json` switch for machine output.

- Validate prerequisites for a feature or CI step with `check-prerequisites.ps1`:
  - Examples:
    ```powershell
    # Check and print machine-friendly JSON output
    .\.specify\scripts\powershell\check-prerequisites.ps1 -Json

    # Check implementation phase prerequisites (plan.md + tasks.md required)
    .\.specify\scripts\powershell\check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks

    # Output paths only (no validation)
    .\.specify\scripts\powershell\check-prerequisites.ps1 -PathsOnly
    ```

Notes:
- These scripts are intended to be safe to run locally and in CI; prefer the `-Json` or `-PathsOnly` modes for automation.
- The `create-new-feature.ps1` script attempts to create a git branch when run inside a git repo. If you'd prefer not to create a branch automatically, create the spec files manually and set the `SPECIFY_FEATURE` env var for local testing.

Stashing and housekeeping
- Use `git stash push --include-untracked` before large housekeeping operations if you need to preserve local edits.

Questions or exceptions
- If you believe a commit should bypass the linting rules, discuss it on the PR or use `--no-verify` with care.

Thanks for contributing!
