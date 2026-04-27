$body = @{
    username = "testuser@test.com"
    email = "testuser@test.com"
    password = "test123"
    country = "CN"
} | ConvertTo-Json

try {
    $r = Invoke-WebRequest -Uri 'http://localhost:3001/api/auth/register' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
    Write-Host "Status:" $r.StatusCode
    Write-Host "Body:" $r.Content
} catch {
    Write-Host "Status:" $_.Exception.Response.StatusCode
    Write-Host "Error:" $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        $reader.Close()
        Write-Host "Response Body:" $errBody
    }
}
