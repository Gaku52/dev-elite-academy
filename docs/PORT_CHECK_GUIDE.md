# ポート5432の接続確認ガイド

## 🔍 ポート確認方法

### 1. Supabaseの実際のホスト名を取得

Supabaseダッシュボードから：
1. Settings → Database
2. Connection string セクション
3. `Host` の値をコピー（例: `db.abcdefghijkl.supabase.co`）

### 2. Windows PowerShellでポート確認

```powershell
# 実際のホスト名に置き換えてください
Test-NetConnection -ComputerName db.YOUR-PROJECT-ID.supabase.co -Port 5432

# 例
Test-NetConnection -ComputerName db.abcdefghijkl.supabase.co -Port 5432
```

### 3. コマンドプロンプトでの確認

```cmd
# telnetを使用（Windows 10/11では有効化が必要）
telnet db.YOUR-PROJECT-ID.supabase.co 5432

# nslookupでホスト名解決の確認
nslookup db.YOUR-PROJECT-ID.supabase.co
```

### 4. curlを使用した確認（Git Bash）

```bash
# ホストの疎通確認
curl -v telnet://db.YOUR-PROJECT-ID.supabase.co:5432

# タイムアウトを設定して確認
timeout 5 bash -c "</dev/tcp/db.YOUR-PROJECT-ID.supabase.co/5432" && echo "Port 5432 is open" || echo "Port 5432 is closed"
```

## ✅ 確認結果の見方

### 成功の場合
```
TcpTestSucceeded : True
```
- ポート5432が開いており、接続可能

### 失敗の場合
```
TcpTestSucceeded : False
```
考えられる原因：
- ファイアウォールでブロックされている
- プロキシ設定の問題
- VPNの影響
- ISPレベルでのブロック

## 🔧 ポートがブロックされている場合の対処法

### 1. Windows Defenderファイアウォール確認
```powershell
# 管理者権限のPowerShellで実行
Get-NetFirewallRule -DisplayName "*PostgreSQL*"
Get-NetFirewallRule -DisplayName "*5432*"

# ルールを追加（管理者権限必要）
New-NetFirewallRule -DisplayName "PostgreSQL Outbound" -Direction Outbound -Protocol TCP -RemotePort 5432 -Action Allow
```

### 2. 企業ネットワークの場合
- IT部門に問い合わせて、ポート5432の開放を依頼
- または、Connection Pooling（ポート6543）を試す

### 3. 代替ポートの使用
Supabaseは以下のポートも提供：
- **6543**: Connection Pooling（推奨）
- **443**: HTTPS経由の接続（一部のプランのみ）

```powershell
# ポート6543の確認
Test-NetConnection -ComputerName db.YOUR-PROJECT-ID.supabase.co -Port 6543
```

### 4. VPN/プロキシの確認
- VPNを一時的に切断して再テスト
- プロキシ設定を確認：
  ```powershell
  netsh winhttp show proxy
  ```

## 📊 診断スクリプト

以下のPowerShellスクリプトで総合診断：

```powershell
# Supabase接続診断スクリプト
$host_name = "db.YOUR-PROJECT-ID.supabase.co"  # ← ここを変更

Write-Host "=== Supabase Connection Diagnostic ===" -ForegroundColor Cyan

# DNS解決
Write-Host "`n1. DNS Resolution:" -ForegroundColor Yellow
Resolve-DnsName $host_name

# ポート5432確認
Write-Host "`n2. Port 5432 (Direct):" -ForegroundColor Yellow
Test-NetConnection -ComputerName $host_name -Port 5432 | Select-Object TcpTestSucceeded, RemoteAddress

# ポート6543確認
Write-Host "`n3. Port 6543 (Pooled):" -ForegroundColor Yellow
Test-NetConnection -ComputerName $host_name -Port 6543 | Select-Object TcpTestSucceeded, RemoteAddress

# ポート443確認（HTTPS）
Write-Host "`n4. Port 443 (HTTPS):" -ForegroundColor Yellow
Test-NetConnection -ComputerName $host_name -Port 443 | Select-Object TcpTestSucceeded, RemoteAddress

# ファイアウォール確認
Write-Host "`n5. Firewall Rules:" -ForegroundColor Yellow
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*5432*" -or $_.DisplayName -like "*PostgreSQL*"} | Select-Object DisplayName, Enabled, Direction

Write-Host "`n=== Diagnostic Complete ===" -ForegroundColor Green
```

## 🆘 すべて失敗する場合

1. **別のネットワークで試す**
   - モバイルホットスポット
   - 自宅のWiFi（会社の場合）

2. **Supabaseのステータス確認**
   - https://status.supabase.com/

3. **接続文字列で直接確認**
   ```
   postgresql://postgres:PASSWORD@db.YOUR-PROJECT-ID.supabase.co:5432/postgres?sslmode=require
   ```

---
注意: `YOUR-PROJECT-ID` を実際のプロジェクトIDに置き換えてください。