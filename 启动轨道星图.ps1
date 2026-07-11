param([int]$Port = 4173)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Dist = Join-Path $Root 'dist'
$Url = "http://127.0.0.1:$Port/"
$PidFile = Join-Path $Root '.orbital-atlas-server.pid'
$LogFile = Join-Path $Root '.orbital-atlas-server.log'

function Test-AtlasServer {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch { return $false }
}

if (Test-AtlasServer) { Start-Process $Url; exit 0 }

if (-not (Test-Path (Join-Path $Dist 'index.html'))) {
  $npm = Join-Path $env:ProgramFiles 'nodejs\npm.cmd'
  if (-not (Test-Path $npm)) { throw 'Node.js/npm was not found.' }
  Push-Location $Root
  try {
    & $npm install
    if ($LASTEXITCODE -ne 0) { throw 'npm install failed.' }
    & $npm run build
    if ($LASTEXITCODE -ne 0) { throw 'npm run build failed.' }
  } finally { Pop-Location }
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
  $arguments = @('-m','http.server',"$Port",'--bind','127.0.0.1','--directory',$Dist)
  $process = Start-Process -FilePath $python.Source -ArgumentList $arguments -WorkingDirectory $Root -RedirectStandardOutput $LogFile -RedirectStandardError "$LogFile.error" -WindowStyle Hidden -PassThru
} else {
  $npx = Join-Path $env:ProgramFiles 'nodejs\npx.cmd'
  if (-not (Test-Path $npx)) { throw 'Neither Python nor Node.js server runtime was found.' }
  $arguments = @('--yes','serve','-l',"tcp://127.0.0.1:$Port",'-s',$Dist)
  $process = Start-Process -FilePath $npx -ArgumentList $arguments -WorkingDirectory $Root -RedirectStandardOutput $LogFile -RedirectStandardError "$LogFile.error" -WindowStyle Hidden -PassThru
}
Set-Content -LiteralPath $PidFile -Value $process.Id -Encoding ASCII
$ready = $false
for ($attempt=0; $attempt -lt 40; $attempt+=1) {
  Start-Sleep -Milliseconds 250
  if (Test-AtlasServer) { $ready=$true; break }
  if ($process.HasExited) { break }
}
if (-not $ready) {
  if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force }
  throw "Local server failed to start. See: $LogFile.error"
}
Start-Process $Url
