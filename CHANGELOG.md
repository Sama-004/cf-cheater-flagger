# CHANGELOG.md

## 1.5 (2024-07-09)

Features:

- Changed cheater detection logic
- Changed contest threshold to 8 instead of all contests
- Fetch submissions in batches of 100 until it has data for at least 8 contests
- Partial verdicts are not counted as cheat
- Don't flag above 2100 rated

Fix:

- Now also works on `codeforces.com/profile/username/`
- Only counts contest participations and not virtual contest
