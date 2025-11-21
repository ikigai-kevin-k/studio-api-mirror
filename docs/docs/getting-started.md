# 快速開始

本指南將幫助您快速開始使用 Studio API。

## 前置需求

- HTTP 客戶端（如 curl、Postman、或任何 HTTP 庫）
- WebSocket 客戶端（用於即時通訊）
- API 認證憑證（`SERVICE_API_SIGNATURE`）

## 基本設置

### 1. 獲取 API 端點

Studio API 的基礎 URL 通常是：
```
https://your-studio-api-domain.com
```

### 2. 設置認證

所有 HTTP API 請求都需要在 Header 中包含認證簽名：

```http
X-Service-Api-Signature: your-service-api-signature
```

### 3. WebSocket 連接

WebSocket 連接需要以下參數：
- `id`: 設備 ID
- `token`: WebSocket 認證 token

連接 URL 格式：
```
wss://your-studio-api-domain.com/v1/ws?id={deviceId}&token={token}
```

## 基本流程

### 1. 註冊設備

首先，您需要透過 HTTP API 註冊設備：

```bash
curl -X POST https://your-studio-api-domain.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-signature" \
  -d '{
    "deviceId": "device-001"
  }'
```

### 2. 建立 WebSocket 連接

建立 WebSocket 連接以接收即時更新：

```javascript
const ws = new WebSocket('wss://your-studio-api-domain.com/v1/ws?id=device-001&token=your-token');
```

### 3. 更新設備狀態

透過 WebSocket 發送狀態更新：

```javascript
ws.send(JSON.stringify({
  event: 'serviceStatus',
  data: {
    status: 'up'
  }
}));
```

### 4. 發送錯誤信號

透過 WebSocket 發送錯誤信號：

```javascript
ws.send(JSON.stringify({
  event: 'serviceSignal',
  data: {
    signal: {
      msgId: 'error-001',
      content: 'Device error occurred',
      metadata: {
        signalType: 'error',
        title: 'Device Error',
        description: 'A critical error has occurred'
      }
    }
  }
}));
```

## 下一步

- 閱讀 [API 概述](api/overview.md) 了解所有可用的 API
- 查看 [範例程式碼](examples/javascript.md) 學習更多用法
- 參考 [認證文檔](api/authentication.md) 了解詳細的認證機制

