# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` branch | Yes |
| Older tags | Best effort |

## Reporting a vulnerability

**Please do not open public GitHub issues for security vulnerabilities.**

1. Open a private security advisory on GitHub (**Security → Advisories → Report a vulnerability**), or
2. Contact the maintainer via the repository owner profile: [Amrit000-HX](https://github.com/Amrit000-HX)

Include:

- Description of the issue
- Steps to reproduce
- Impact assessment (if known)
- Suggested fix (optional)

We aim to acknowledge reports within **7 days**.

## Exposed credential response (for maintainers)

If a secret (API key, database URI, password) is accidentally committed to this repository:

1. **Immediately rotate / revoke the exposed credential** in the issuing service (MongoDB Atlas, EmailJS, OpenAI, etc.). Do not wait — treat it as compromised from the moment of the commit.
2. **Remove the secret from the current branch** — replace with an environment-variable reference or placeholder.
3. **Purge the secret from git history** using `git filter-repo` (preferred) or `BFG Repo Cleaner`:
   ```bash
   # Install git-filter-repo, then:
   git filter-repo --replace-text <(echo 'OLD_SECRET_VALUE==>REDACTED')
   git push --force --all
   git push --force --tags
   ```
4. **Check GitHub secret-scanning alerts** (Security → Secret scanning) and close the alert as "Revoked".
5. **Audit access logs** in the affected service to check for unauthorized access during the exposure window.
6. **Notify affected users** if sensitive data may have been accessed.

> ⚠️ Even after removing a secret from git history and force-pushing, assume it was captured by bots scanning GitHub in real time. Always rotate first, then clean.

## Security practices for contributors

- **Never commit** `.env`, API keys, tokens, passwords, or connection strings with credentials.
- Use `.env.example` for documented variable **names** only — never fill in real values.
- Backup files (`*.backup`, `*.bak`, `*.tmp`) are excluded from git via `.gitignore` — keep it that way.
- Run `git status` before committing to verify no sensitive files are staged.
- Consider using [`git-secrets`](https://github.com/awslabs/git-secrets) or [`pre-commit`](https://pre-commit.com/) hooks to prevent accidental credential commits.

## Known limitations (demo)

- Passwords in demo auth are not production-hashed (no bcrypt). Do not use in production.
- File uploads are processed in memory without long-term encryption at rest.
- Client-side analysis may process document text in the browser — review privacy implications before production use.
- MediSense is **not HIPAA-certified**; do not deploy with real patient data without legal and security review.
