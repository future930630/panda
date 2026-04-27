Get-ChildItem -Filter *.html -Recurse | Where-Object { $_.FullName -notlike '*node_modules*' } | ForEach-Object {
    $f = $_.FullName
    $content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8) -replace '\?v=20260417-FINAL','?v=20260424-avatar' -replace '\?v=20260421-nav','?v=20260424-avatar'
    [System.IO.File]::WriteAllText($f, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated: $f"
}
