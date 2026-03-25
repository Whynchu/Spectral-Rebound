# Release Flow

## Version policy

- Every push to `main` must ship a new game version.
- `src/data/version.js` is the source of truth for the runtime version.
- `index.html` keeps a static fallback version string for `file://` testing and must match the runtime version.

## Bump process

Run the bump script before committing a release-bound change:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bump-version.ps1 "Short label"
```

The script:

- increments the numeric version,
- updates `src/data/version.js`,
- updates the fallback version banner in `index.html`.

## Validation

- Load `index.html` through a local HTTP server for normal module behavior.
- If you open the file directly from disk, the fallback label in `index.html` should still show the current version.
