param()
$ErrorActionPreference = 'SilentlyContinue'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PidFile = Join-Path $Root '.orbital-atlas-server.pid'
if (Test-Path $PidFile) {
  $serverPid = [int](Get-Content -LiteralPath $PidFile -Raw)
  Stop-Process -Id $serverPid -Force
  Remove-Item -LiteralPath $PidFile -Force
  Write-Host 'ORBITAL ATLAS 本地服务器已停止。'
} else {
  Write-Host '未发现由启动工具记录的服务器进程。'
}
