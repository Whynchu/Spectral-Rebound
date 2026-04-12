Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Step([string]$message) {
  Write-Host "==> $message" -ForegroundColor Cyan
}

Step "Verifying version surfaces"
powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "verify-version.ps1")

Step "Checking script.js syntax"
node --check (Join-Path $PSScriptRoot "..\\script.js")

Step "Running systems tests"
node (Join-Path $PSScriptRoot "test-systems.mjs")

Write-Host "All verification checks passed." -ForegroundColor Green
