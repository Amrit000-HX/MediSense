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

## Security practices for contributors

- Never commit `.env`, API keys, or credentials.
- Use `.env.example` for documented variable names only.
- The demo API uses in-memory storage — not suitable for production PHI without hardening.
- MediSense is **not HIPAA-certified**; do not deploy with real patient data without legal and security review.

## Known limitations (demo)

- Passwords in demo auth are not production-hashed.
- File uploads are processed in memory without long-term encryption at rest.
- Client-side analysis may process document text in the browser — review privacy implications before production use.
