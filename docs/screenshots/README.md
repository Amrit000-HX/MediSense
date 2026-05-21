# Screenshots for README

Adding screenshots dramatically improves how recruiters perceive your project on GitHub.

## Recommended captures

| File | Page | What to show |
|------|------|--------------|
| `home.png` | `/` | Hero section + disease library |
| `upload-report.png` | `/upload-report` | PDF uploaded with analysis results |
| `voice.png` | `/voice-analyzer` | Recording + transcript + conditions |
| `dashboard.png` | `/dashboard` | Metrics, reports, GPS section |

## How to capture

1. Run `npm run dev:all`
2. Open http://localhost:5173
3. Use **Windows + Shift + S** or browser DevTools → device toolbar for mobile view
4. Save PNG files in this folder (`docs/screenshots/`)
5. Commit and push — README will display them automatically

## Optional: demo GIF

Record a 10–15 second GIF (e.g. ShareX, ScreenToGif) showing upload → results, and add to README:

```markdown
![Demo](./docs/screenshots/demo.gif)
```
