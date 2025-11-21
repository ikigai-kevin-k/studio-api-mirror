# 認證

Studio API 使用兩種認證方式：HTTP API 簽名認證和 WebSocket Token 認證。

## HTTP API 認證

### 認證方式

所有 HTTP API 請求都必須在 Header 中包含服務 API 簽名：

```http
X-Service-Api-Signature: your-service-api-signature
```

### 範例

```bash
curl -X POST https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{"deviceId": "device-001"}'
```

### JavaScript 範例

```javascript
const response = await fetch('https://api.example.com/v1/service/device', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Service-Api-Signature': 'your-service-api-signature'
  },
  body: JSON.stringify({
    deviceId: 'device-001'
  })
});
```

### Python 範例

```python
import requests

headers = {
    'Content-Type': 'application/json',
    'X-Service-Api-Signature': 'your-service-api-signature'
}

response = requests.post(
    'https://api.example.com/v1/service/device',
    headers=headers,
    json={'deviceId': 'device-001'}
)
```

## WebSocket 認證

### 認證方式

WebSocket 連接通過 URL 查詢參數進行認證：

```
wss://api.example.com/v1/ws?id={deviceId}&token={token}
```

### 必需參數

- `id` (必需): 設備 ID
- `token` (必需): WebSocket 認證 token

### 連接範例

```javascript
const deviceId = 'device-001';
const token = 'your-websocket-token';
const ws = new WebSocket(
  `wss://api.example.com/v1/ws?id=${deviceId}&token=${token}`
);
```

### 認證失敗

如果認證失敗，WebSocket 連接會立即關閉，並返回以下格式的錯誤訊息：

```json
{
  "type": "kick",
  "error": {
    "code": 3000,
    "message": "認證錯誤訊息"
  }
}
```

### 關閉代碼

- `3000` - 未授權 (Unauthorized)
- `3003` - 禁止訪問 (Forbidden)

## 安全建議

1. **保護您的簽名和 Token**
   - 不要將認證憑證提交到版本控制系統
   - 使用環境變數或安全的配置管理系統

2. **使用 HTTPS/WSS**
   - 所有 API 請求都應該透過加密連接進行
   - 避免在生產環境中使用 HTTP/WS

3. **定期輪換憑證**
   - 定期更新您的 API 簽名和 WebSocket token
   - 在憑證洩露時立即更換

## 下一步

- [HTTP API - 設備管理](http/device.md)
- [WebSocket API - 連接設置](websocket/connection.md)

