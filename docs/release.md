# Release Flow

## Version policy

- Every push to `main` must ship a new game version.
- `src/data/version.js` is the source of truth for version and label.
- The following must always match on release:
  - `src/data/version.js`
  - `version.json`
  - `index.html` fallback banner (`#version-tag`)
  - `window.__APP_BUILD__` in `index.html`
  - `styles.css?v=...` in `index.html`
  - `script.js?v=...` in `index.html`

## Bump process

Run the bump script before committing a release-bound change:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bump-version.ps1 "Short label"
```

The script:

- increments patch version (`major.minor.patch`),
- updates `src/data/version.js`,
- updates `version.json`,
- updates `window.__APP_BUILD__`,
- updates cache-busting query strings for `styles.css` and `script.js`,
- updates the fallback banner in `index.html`.

## Validation

Run the version gate check before commit/push:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-version.ps1
```

This command fails if any required version surface drifts.

Then:

- run `node --check script.js`
- run `node .\scripts\test-systems.mjs`
- load `index.html` through a local HTTP server for module/runtime behavior
- optionally open from `file://` and verify fallback banner still matches

Or run the combined gate in one command:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-all.ps1
```
