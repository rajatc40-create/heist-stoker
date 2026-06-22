# Chartink Webhook Manual Test

Webhook URL:

```text
http://127.0.0.1:3000/api/chartink-webhook?token=heist-stoker-chartink-secret
```

Sample payload:

```json
{
  "stocks": ["RELIANCE", "TATASTEEL", "NIFTY"],
  "trigger_prices": [2868.2, 154.35, 23485],
  "triggered_at": "2026-06-18T09:20:00+05:30",
  "scan_name": "HEIST STOKER Liquidity Sweep",
  "scan_url": "https://chartink.com/screener/heist-stoker-liquidity-sweep",
  "alert_name": "Liquidity Sweep Alert"
}
```

PowerShell test:

```powershell
$payload = Get-Content -Raw -LiteralPath ".\public\samples\chartink-webhook-sample.json"
Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/chartink-webhook?token=heist-stoker-chartink-secret" -Method POST -ContentType "application/json" -Body $payload
```

For real use, change `CHARTINK_WEBHOOK_SECRET` in `.env.local` and use the new token in the Chartink webhook URL.
