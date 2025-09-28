# Contributing guide

This project uses a spec-driven workflow supported by a small "spec kit" (repo-local scripts) plus Git and Conventional Commits for message formatting. The goal is to make it easy for developers to draft specs, run checks (locally or in CI), and keep history clean with well-formed commits.

This project also uses Conventional Commits, a convention for what information to include in git commit message. This is policed in the repository using Husky.

[^3]: Conventional Commits — official specification and examples: https://www.conventionalcommits.org/

[^4]: Husky — lightweight Git hooks for JavaScript projects; used here to run commitlint and other repository checks: https://typicode.github.io/husky/

[^5]: Commitlint — configurable commit message linter that enforces Conventional Commits rules: https://commitlint.js.org/

## Spec‑driven workflow with spec‑kit

### Terminology

- `github/spec‑kit`
  - The GitHub repository and project. This is where the source code and documentation live.[^1]
- `specify`
  - The command‑line tool provided by spec‑kit. You run it in your shell (for example `specify init`, `specify check`). In most projects, the CLI has already been run to initialize the repo, so you don’t need to repeat those steps.[^1]
- specify slash commands (slash-style `/…` commands)
  - The interactive directives you use inside a specify session (often through Copilot Chat in VS Code). Each message must begin with a leading slash (`/`) for specify to interpret it as a command. You can add additional details or arguments after the command name. If you don’t start with a slash, Copilot will treat your input as a free‑form prompt and may route it differently — which may not follow the spec‑driven workflow.[^2]

### Specify slash command summary

| Command      | Description                                                                              |
| ------------ | ---------------------------------------------------------------------------------------- |
| `/specify`   | Define what you want to build (requirements and user stories)                            |
| `/clarify`   | Clarify underspecified areas (must be run before `/plan` unless explicitly skipped)      |
| `/plan`      | Create technical implementation plans with your chosen tech stack                        |
| `/tasks`     | Generate actionable task lists for implementation                                        |
| `/analyze`   | Cross-artifact consistency & coverage analysis (run after `/tasks`, before `/implement`) |
| `/implement` | Execute all tasks to build the feature according to the plan                             |

⚠️ Note: For predictable results, always start with a specify slash command. Free‑form prompts without a leading / may be routed differently by Copilot.

## Typical workflow

1. Create a feature spec (`/specify`)

   Use `/specify <short description>` to draft a focused specification that explains the what and why (user goals, acceptance criteria, observable outcomes). When run in a Git repository, `specify` scaffolds the spec and associates it with a stable feature ID and branch.[^1]

2. Clarify details (`/clarify`)

If the spec leaves open questions, run `/clarify` to resolve them. This ensures the plan is based on a complete, unambiguous spec.[^2]

4. Create the technical plan (`/plan`)

Translate the spec into architecture and tech choices. The plan defines APIs, constraints, and implementation goals so reviewers and implementers share the same mental model.

5. Break the work into tasks (`/tasks`)

Turn the plan into discrete, testable tasks. Each task should have a small, verifiable acceptance criterion and map cleanly to a commit or PR. Well‑scoped tasks accelerate CI and code review.

6. Analyze consistency (`/analyze`)

Run `/analyze` to check that the spec, plan, and tasks align. This step helps catch gaps or contradictions before implementation.

7. Implement and verify (`/implement`)

Implement tasks on the feature branch. Run tests, linters, and prerequisite checks. Commit frequently with focused, conventional commit messages. When the spec, plan, and tasks are satisfied and CI passes, push the branch and open a PR for review and merge.

Notes on Workflow

- The flow is iterative: loop back to /clarify or /plan as new questions arise.
- Each /specify invocation scaffolds a new feature branch and spec. Branches remain isolated until merged.
- If two branches touch similar areas, reconcile by rebasing or merging as usual.
- In conversational workflows (e.g. Copilot Chat), invoking /specify with a short description scaffolds the feature locally and creates a feature branch automatically when run in a Git repository.

Footnotes
[^1]: spec‑kit README — authoritative list of CLI commands and slash commands.
[^2]: DeepWiki overview of spec‑kit: https://deepwiki.com/github/spec-kit/1-overview

## References

- Spec Kit README: https://github.com/github/spec-kit/blob/main/README.md
- DeepWiki overview: https://deepwiki.com/github/spec-kit/1-overview

## Conventional Commits

This repository uses Conventional Commits for commit messages: `type(scope): subject` (for example `feat(theme): add palette editor`). Commit guidance is enforced during the implementation/commit stage and is distinct from the spec and planning steps described above.

- Keep the subject short and imperative; include a body when more context is required.

Why we enforce this

- Husky + Commitlint are installed to keep commit history consistent. The `commit-msg` hook runs `commitlint` and will block invalid messages.

Local checks and hooks

- To validate messages locally you can run:
  ```powershell
  echo "feat: example" > .\tmp-msg.txt
  npx --no -- commitlint --edit .\tmp-msg.txt
  Remove-Item .\tmp-msg.txt
  ```
- If you must bypass the hook (rare), `git commit --no-verify` will skip it.

## Small practical tips

- Keep feature branches focused on a single logical change.
- Use `git stash push --include-untracked` before aggressive housekeeping.
- Add `.tmp/` to `.gitignore` (already done in this repo) to avoid committing temporary capture files.

Questions or exceptions

- If a workflow edge case requires deviating from these rules, note it in the PR and discuss with reviewers.

Thanks for contributing!

## Release notes (how we do releases)

- Feature branches automatically use pre-release version suffixes (for example `1.2.3-beta`) so that builds from feature branches are clearly marked and won't collide with official releases.
- When preparing a release, ensure the version number doesn't conflict with an existing release; the release process should block duplicate/conflicting versions.
- During development, the system may bump the extension version for debugging to ensure reloads pick up changes; this is expected behavior on feature branches.

Basic release steps (developer-facing)

1. Ensure the feature branch is complete, tests pass, and the spec/plan/tasks are satisfied.
2. Remove any pre-release suffix and bump the version for an official release.
3. Prepare release assets (changelog, icons, build artifacts) and open the release PR.
4. After review and CI passes, merge and publish the release.
