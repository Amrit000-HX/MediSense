# Contributing to MediSense

Thank you for your interest in contributing. This project welcomes bug fixes, documentation improvements, and feature proposals.

## Getting started

1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:3000`
5. Run the app: `npm run dev:all`

## Development guidelines

- Use **TypeScript** for new frontend code under `src/`.
- Match existing naming, folder structure, and component patterns (shadcn/Radix).
- Keep changes focused — one feature or fix per pull request.
- Do not commit secrets (`.env`, API keys, EmailJS keys).
- Add or update documentation when changing setup steps or APIs.

## Commit messages

Use clear, conventional prefixes when possible:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` code change without behavior change
- `chore:` tooling, deps, CI

Example: `feat: add Hindi voice analyzer hints on VoiceAnalyzerPage`

## Pull request process

1. Create a branch from `main`: `git checkout -b feat/your-feature-name`
2. Ensure the project builds: `npm run build`
3. Describe what changed and how to test it in the PR description.
4. Link any related issues.
5. Wait for review — maintainers may request changes.

## Reporting bugs

Open an issue using the **Bug report** template. Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser/OS and Node version
- Screenshots or console errors if applicable

## Feature requests

Open an issue using the **Feature request** template. Explain the user problem and proposed solution.

## Code of conduct

Be respectful and constructive. See community standards on the main repository README.

## Questions

Open a GitHub issue with the `question` label or use the in-app Contact page when running the app locally.
