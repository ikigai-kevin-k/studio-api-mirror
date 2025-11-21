# WebSocket API - 設備註冊

雖然設備註冊主要透過 HTTP API 進行，但 WebSocket 連接本身也包含了設備識別的功能。

## 連接時註冊

當您建立 WebSocket 連接時，系統會自動識別並註冊設備（如果尚未註冊）。

### 連接 URL

```
wss://api.example.com/v1/ws?id={deviceId}&token={token}
```

### 設備識別

連接 URL 中的 `id` 參數用於識別設備：

- 如果設備已存在，連接會成功建立
- 如果設備不存在，系統可能會自動創建設備記錄（取決於配置）

### 範例

```javascript
const deviceId = 'device-001';
const token = 'your-websocket-token';

const ws = new WebSocket(
  `wss://api.example.com/v1/ws?id=${deviceId}&token=${token}`
);

ws.onopen = () => {
  console.log(`設備 ${deviceId} 已連接`);
  // 設備已成功註冊/識別
};

ws.onerror = (error) => {
  console.error('連接失敗:', error);
  // 可能是認證失敗或設備 ID 無效
};
```

## 連接確認

連接成功後，您會收到連接確認。可以透過監聽消息來確認：

```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'ack') {
    console.log('連接已確認，設備已註冊');
  }
};
```

## 與 HTTP API 的關係

### 推薦流程

1. **先使用 HTTP API 註冊設備**（推薦）:
   ```javascript
   // 1. 透過 HTTP API 註冊設備
   await fetch('https://api.example.com/v1/service/device', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'X-Service-Api-Signature': 'your-signature'
     },
     body: JSON.stringify({
       deviceId: 'device-001'
     })
   });
   
   // 2. 然後建立 WebSocket 連接
   const ws = new WebSocket(
     `wss://api.example.com/v1/ws?id=device-001&token=${token}`
   );
   ```

2. **直接使用 WebSocket 連接**（如果系統支持自動註冊）:
   ```javascript
   // 直接建立連接，系統會自動處理設備註冊
   const ws = new WebSocket(
     `wss://api.example.com/v1/ws?id=device-001&token=${token}`
   );
   ```

## 設備 ID 要求

- 設備 ID 必須是唯一的
- 長度限制：1-255 字元
- 建議使用有意義的命名規則，如：`device-{location}-{number}`

## 錯誤處理

### 認證失敗

如果設備 ID 或 token 無效，連接會立即關閉：

```javascript
ws.onclose = (event) => {
  if (event.code === 3000) {
    console.error('認證失敗:', event.reason);
    // 檢查設備 ID 和 token 是否正確
  }
};
```

### 設備 ID 格式錯誤

如果設備 ID 格式不符合要求，連接可能會失敗：

```javascript
// 錯誤：設備 ID 為空
const ws1 = new WebSocket('wss://api.example.com/v1/ws?id=&token=token');

// 正確：提供有效的設備 ID
const ws2 = new WebSocket('wss://api.example.com/v1/ws?id=device-001&token=token');
```

## 最佳實踐

1. **預先註冊**: 在建立 WebSocket 連接前，先使用 HTTP API 註冊設備
2. **ID 管理**: 使用一致的設備 ID 命名規則
3. **錯誤處理**: 處理連接失敗的情況
4. **日誌記錄**: 記錄設備註冊和連接事件

## 下一步

- [狀態更新](status-update.md) - 學習如何更新設備狀態
- [錯誤信號](error-signal.md) - 學習如何發送錯誤信號

