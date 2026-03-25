param(
  [string]$Label = "Manual bump"
)

$versionFile = Join-Path $PSScriptRoot "..\\src\\data\\version.js"
$indexFile = Join-Path $PSScriptRoot "..\\index.html"

$versionContent = Get-Content $versionFile -Raw
$versionMatch = [regex]::Match($versionContent, "num:\s*'(?<major>\d+)\.(?<minor>\d+)'")

if (-not $versionMatch.Success) {
  throw "Could not find version number in src/data/version.js"
}

$major = [int]$versionMatch.Groups["major"].Value
$minor = [int]$versionMatch.Groups["minor"].Value + 1
$nextVersion = "$major.$minor"

$escapedLabel = $Label.Replace("'", "\'")
$updatedVersionContent = [regex]::Replace(
  $versionContent,
  "const VERSION = \{ num: '[^']+', label: '[^']+' \};",
  "const VERSION = { num: '$nextVersion', label: '$escapedLabel' };"
)
Set-Content -Path $versionFile -Value $updatedVersionContent

$indexContent = Get-Content $indexFile -Raw
$updatedIndexContent = [regex]::Replace(
  $indexContent,
  "// prototype v[^<]+",
  "// prototype v$nextVersion - $Label",
  1
)
Set-Content -Path $indexFile -Value $updatedIndexContent

Write-Output "Bumped version to $nextVersion"
