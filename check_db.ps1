Add-Type -AssemblyName System.Data.SQLite
$dbPath = 'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0\serve_app\pandashield.db'
$conn = New-Object System.Data.SQLite.SQLiteConnection("Data Source=$dbPath")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT sku, namezh, brand, specs FROM Products WHERE sku='shield-cut5'"
$reader = $cmd.ExecuteReader()
if ($reader.Read()) {
    Write-Host "sku:" $reader.GetValue(0)
    Write-Host "namezh:" $reader.GetValue(1)
    Write-Host "brand:" $reader.GetValue(2)
    $specs = $reader.GetValue(3).ToString()
    Write-Host "specs (first 300 chars):" $specs.Substring(0, [Math]::Min(300, $specs.Length))
} else {
    Write-Host "not found"
}
$conn.Close()