# TTGCollector Repo Memory Backup

This file is a tracked backup of TTGCollector deployment checkpoints captured in `/memories/repo/implementation-plan.md`.

## Source

- /memories/repo/implementation-plan.md

## Snapshot Date

- 2026-06-02

## Multi-Repo CI/CD Implementation Plan

- Create a separate parent directory for each project/repo under the deployment user’s home directory.
- Repeat the releases/shared/current structure inside each project’s directory.
- Ensure each project has its own unique project folder name to avoid conflicts.
- Set up separate deployment scripts or CI/CD jobs for each project, targeting their respective directories.
- Configure web server (e.g., Nginx) and process manager (e.g., systemd, PM2) to point to the correct project/current path for each app.
- Maintain independent release and rollback processes for each project.
- Document the mapping between each repo and its server directory for clarity.

## Session Checkpoint - 2026-06-02

- TTGCollector deploy workflow exists at TTGCollector/.github/workflows/deploy.yml.
- Identified critical issue: deploy step rsync source is dist/ at repo root, but build output is from client build (expected client/dist).
- Identified likely scope gap: workflow deploys frontend artifacts only; backend deployment/restart path is not defined.
- Identified reproducibility concern: workflow runs npm ci at root while subproject installs are managed in nested client/server scripts.
- Minimal next fix: change rsync source from dist/ to client/dist/.
- Follow-up decision needed: confirm whether TTGCollector CI/CD should deploy backend, frontend only, or split pipelines.
- User indicated next active task is debugging a failed references wiki CI/CD run.

## TTGCollector Next Session Checkpoint - 2026-06-02

- TTGCollector deployment workflow run stayed in queued state for about one hour after push to main.
- Most likely cause: no eligible self-hosted runner available for the job.
- Highest-probability checks for next session:
  - Confirm organization runner is online.
  - Confirm workflow runs-on labels exactly match runner labels.
  - Confirm runner group allows the TTGCollector repository.
  - Confirm runner is not busy/stuck on another job.
  - Confirm no environment approval gate is waiting.
- Prior TTGCollector workflow findings still apply:
  - Deploy source path should be client/dist for this repo layout.
  - Decide whether deployment scope is frontend-only or includes backend rollout/restart.
