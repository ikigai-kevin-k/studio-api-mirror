# API 概述

Studio API 提供兩種類型的 API：HTTP REST API 和 WebSocket API。

## API 類型

### HTTP REST API

用於同步操作，如設備註冊、狀態查詢等。

**基礎路徑**: `/v1/service`

**主要端點**:
- `/v1/service/device` - 設備管理
- `/v1/service/status` - 狀態管理
- `/v1/service/signal` - 錯誤信號日誌

### WebSocket API

用於即時雙向通訊，如狀態更新、錯誤信號發送等。

**連接端點**: `/v1/ws`

## 認證

### HTTP API 認證

所有 HTTP API 請求都需要在 Header 中包含認證簽名：

```http
X-Service-Api-Signature: your-service-api-signature
```

### WebSocket 認證

WebSocket 連接通過 URL 查詢參數進行認證：

```
wss://domain.com/v1/ws?id={deviceId}&token={token}
```

## 響應格式

### 成功響應

```json
{
  "ok": true,
  "data": {
    // 響應數據
  }
}
```

### 錯誤響應

```json
{
  "ok": false,
  "error": {
    "code": 400,
    "message": "錯誤訊息"
  }
}
```

## 狀態碼

- `200 OK` - 請求成功
- `400 Bad Request` - 請求參數錯誤
- `401 Unauthorized` - 認證失敗
- `404 Not Found` - 資源不存在
- `500 Internal Server Error` - 伺服器錯誤

## 下一步

- [HTTP API - 設備管理](http/device.md)
- [HTTP API - 狀態管理](http/status.md)
- [WebSocket API - 連接設置](websocket/connection.md)

