# Get the directory of the script
$scriptDirectory = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

# Set the root directory to the script directory
Set-Location $scriptDirectory

# Store the root directory depth for later use
$rootDepth = (Get-Location).Path -split '\\' | Measure-Object | Select-Object -ExpandProperty Count

# Get ignore patterns from the external file
$ignorePatterns = Get-Content -Path "$scriptDirectory\ignore_patterns.txt" -Raw | Out-String
$ignoreRegex = ($ignorePatterns -split "`r`n" | Where-Object { $_.Trim() -ne "" }) -join "|"

Write-Host "Logging project structure to: project_structure.txt"

$output = Get-ChildItem -Recurse | Where-Object { $_.FullName -notmatch $ignoreRegex -and -not $_.PSIsContainer } | ForEach-Object {
    $depth = ($_.FullName -split '\\').Count - $rootDepth - 1;
    $indentation = "    " * $depth
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    $fileContent = (Get-Content $_.FullName -Raw) -replace '```', '``'
    $lineCount = ($fileContent -split "`n").Count # count actual content lines only
    Write-Host "Processing file: $relativePath : $lineCount lines"
    "$indentation$relativePath`n`n``````$($_.Extension.TrimStart('.'))`n$fileContent`n``````"
}

$output | Out-File -FilePath "$scriptDirectory\project_structure.txt" -Encoding UTF8

Write-Host "Project structure logging completed."
