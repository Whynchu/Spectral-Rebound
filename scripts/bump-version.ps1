param(
  [Parameter(Mandatory = $true)]
  [string]$Label
)

$versionFile = Join-Path $PSScriptRoot "..\\src\\data\\version.js"
$versionJsonFile = Join-Path $PSScriptRoot "..\\version.json"
$indexFile = Join-Path $PSScriptRoot "..\\index.html"

$versionContent = Get-Content $versionFile -Raw
$versionMatch = [regex]::Match($versionContent, "num:\s*'(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)'")

if (-not $versionMatch.Success) {
  throw "Could not find semantic version (major.minor.patch) in src/data/version.js"
}

$major = [int]$versionMatch.Groups["major"].Value
$minor = [int]$versionMatch.Groups["minor"].Value
$patch = [int]$versionMatch.Groups["patch"].Value + 1
$nextVersion = "$major.$minor.$patch"

$escapedLabel = $Label.Replace("'", "\'")
$updatedVersionContent = [regex]::Replace(
  $versionContent,
  "const VERSION = \{ num: '[^']+', label: '[^']+' \};",
  "const VERSION = { num: '$nextVersion', label: '$escapedLabel' };"
)
Set-Content -Path $versionFile -Value $updatedVersionContent

$versionJsonContent = "{ `"version`": `"$nextVersion`", `"label`": `"$Label`" }"
Set-Content -Path $versionJsonFile -Value $versionJsonContent

$indexContent = Get-Content $indexFile -Raw
$updatedIndexContent = $indexContent
$updatedIndexContent = [regex]::Replace(
  $updatedIndexContent,
  "window\.__APP_BUILD__\s*=\s*'[^']+';",
  "window.__APP_BUILD__ = '$nextVersion';"
)
$updatedIndexContent = [regex]::Replace(
  $updatedIndexContent,
  "(<link rel=`"stylesheet`" href=`"styles\.css\?v=)[^`"]+(`">)",
  "`${1}$nextVersion`${2}"
)
$updatedIndexContent = [regex]::Replace(
  $updatedIndexContent,
  "(<script type=`"module`" src=`"script\.js\?v=)[^`"]+(`"></script>)",
  "`${1}$nextVersion`${2}"
)
$updatedIndexContent = [regex]::Replace(
  $updatedIndexContent,
  "(<div class=`"eyebrow`" id=`"version-tag`">// prototype v)[^<]+(</div>)",
  "`${1}$nextVersion - $Label`${2}"
)
Set-Content -Path $indexFile -Value $updatedIndexContent

Write-Output "Bumped version to $nextVersion ($Label)"
