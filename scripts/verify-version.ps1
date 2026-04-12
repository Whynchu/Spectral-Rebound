Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Join-Path $PSScriptRoot ".."
$versionFile = Join-Path $repoRoot "src\\data\\version.js"
$versionJsonFile = Join-Path $repoRoot "version.json"
$indexFile = Join-Path $repoRoot "index.html"

$errors = @()

function Add-VersionError([string]$message) {
  $script:errors += $message
}

$versionContent = Get-Content $versionFile -Raw
$versionMatch = [regex]::Match(
  $versionContent,
  "const VERSION = \{ num: '(?<version>\d+\.\d+\.\d+)', label: '(?<label>[^']*)' \};"
)

if (-not $versionMatch.Success) {
  Add-VersionError "src/data/version.js must define VERSION as major.minor.patch."
}

$sourceVersion = $versionMatch.Groups["version"].Value
$sourceLabel = $versionMatch.Groups["label"].Value

if ($sourceVersion -and -not [regex]::IsMatch($sourceVersion, "^\d+\.\d+\.\d+$")) {
  Add-VersionError "Version in src/data/version.js is not major.minor.patch: $sourceVersion"
}

$versionJsonContent = Get-Content $versionJsonFile -Raw | ConvertFrom-Json
if ($versionJsonContent.version -ne $sourceVersion) {
  Add-VersionError "version.json version ($($versionJsonContent.version)) does not match src/data/version.js ($sourceVersion)."
}
if ($versionJsonContent.label -ne $sourceLabel) {
  Add-VersionError "version.json label ($($versionJsonContent.label)) does not match src/data/version.js ($sourceLabel)."
}

$indexContent = Get-Content $indexFile -Raw
$appBuildMatch = [regex]::Match($indexContent, "window\.__APP_BUILD__\s*=\s*'(?<version>[^']+)';")
$styleVersionMatch = [regex]::Match($indexContent, "styles\.css\?v=(?<version>[^`"]+)")
$scriptVersionMatch = [regex]::Match($indexContent, "script\.js\?v=(?<version>[^`"]+)")
$fallbackMatch = [regex]::Match($indexContent, "<div class=`"eyebrow`" id=`"version-tag`">// prototype v(?<version>[^< ]+)\s*-\s*(?<label>[^<]+)</div>")

if (-not $appBuildMatch.Success) {
  Add-VersionError "index.html missing window.__APP_BUILD__."
} elseif ($appBuildMatch.Groups["version"].Value -ne $sourceVersion) {
  Add-VersionError "window.__APP_BUILD__ ($($appBuildMatch.Groups["version"].Value)) does not match src/data/version.js ($sourceVersion)."
}

if (-not $styleVersionMatch.Success) {
  Add-VersionError "index.html missing styles.css cache-busting query."
} elseif ($styleVersionMatch.Groups["version"].Value -ne $sourceVersion) {
  Add-VersionError "styles.css cache-busting version ($($styleVersionMatch.Groups["version"].Value)) does not match src/data/version.js ($sourceVersion)."
}

if (-not $scriptVersionMatch.Success) {
  Add-VersionError "index.html missing script.js cache-busting query."
} elseif ($scriptVersionMatch.Groups["version"].Value -ne $sourceVersion) {
  Add-VersionError "script.js cache-busting version ($($scriptVersionMatch.Groups["version"].Value)) does not match src/data/version.js ($sourceVersion)."
}

if (-not $fallbackMatch.Success) {
  Add-VersionError "index.html missing fallback version banner."
} else {
  if ($fallbackMatch.Groups["version"].Value -ne $sourceVersion) {
    Add-VersionError "Fallback banner version ($($fallbackMatch.Groups["version"].Value)) does not match src/data/version.js ($sourceVersion)."
  }
  if ($fallbackMatch.Groups["label"].Value.Trim() -ne $sourceLabel) {
    Add-VersionError "Fallback banner label ($($fallbackMatch.Groups["label"].Value.Trim())) does not match src/data/version.js ($sourceLabel)."
  }
}

if ($errors.Count -gt 0) {
  Write-Host "Version verification failed:" -ForegroundColor Red
  foreach ($errorLine in $errors) {
    Write-Host " - $errorLine" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Version verification passed: $sourceVersion ($sourceLabel)" -ForegroundColor Green
