Title: CI job for version-stamp (defer)

Summary

Add a CI job to run `npm run version-stamp` for feature-branch builds and store `dist/version-stamp.json` as a build artifact. This would help produce uniquely identified builds during CI.

Decision

Defer: Not doing CI automation now. We'll keep the lightweight `scripts/version-stamp.js` for local use and document the recommended CI snippet in `docs/versioning.md` later.

Acceptance criteria for future work

- A GitHub Actions job or equivalent runs `npm ci` and `npm run version-stamp` on feature branches.
- The job publishes `dist/version-stamp.json` as an artifact for debugging and traceability.
- The job is optional and must be opt-in for this repo (disabled by default).

Notes

- Defer implementation to avoid CI changes while we stabilize local tooling.
- If you'd like, I can open a PR adding the GitHub Actions workflow template when you're ready.
