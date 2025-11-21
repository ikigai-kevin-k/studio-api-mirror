# WebSocket API - 連接設置

WebSocket API 提供即時雙向通訊功能，用於設備狀態更新和錯誤信號處理。

## 建立連接

### 連接 URL

```
wss://api.example.com/v1/ws?id={deviceId}&token={token}
```

### 連接參數

- `id` (string, 必需): 設備 ID
- `token` (string, 必需): WebSocket 認證 token

### 連接範例

#### JavaScript

```javascript
const deviceId = 'device-001';
const token = 'your-websocket-token';
const ws = new WebSocket(
  `wss://api.example.com/v1/ws?id=${deviceId}&token=${token}`
);

ws.onopen = () => {
  console.log('WebSocket 連接已建立');
};

ws.onerror = (error) => {
  console.error('WebSocket 錯誤:', error);
};

ws.onclose = (event) => {
  console.log('WebSocket 連接已關閉', event.code, event.reason);
};
```

#### Python

```python
import asyncio
import websockets
import json

async def connect():
    device_id = 'device-001'
    token = 'your-websocket-token'
    uri = f'wss://api.example.com/v1/ws?id={device_id}&token={token}'
    
    async with websockets.connect(uri) as websocket:
        print('WebSocket 連接已建立')
        # 處理消息...
```

## 消息格式

### 發送消息格式

所有發送到伺服器的消息必須遵循以下格式：

```json
{
  "event": "string",
  "data": {}
}
```

**欄位說明**:
- `event` (string, 必需): 事件類型
- `data` (object, 可選): 事件數據

### 接收消息格式

從伺服器接收的消息格式：

```json
{
  "type": "string",
  "data": {},
  "error": {}
}
```

**欄位說明**:
- `type` (string, 必需): 響應類型
- `data` (object, 可選): 響應數據
- `error` (object, 可選): 錯誤資訊

## 響應類型

### 成功響應類型

- `ack` - 確認消息
- `deviceStatus` - 設備狀態響應
- `errorSignal` - 錯誤信號響應
- `activateBackup` - 備份激活響應

### 錯誤響應類型

- `error` - 錯誤消息
- `kick` - 被踢出連接

## 連接事件

### 連接成功

當連接成功建立時，會觸發 `connection` 事件。

### 連接失敗

如果認證失敗，連接會立即關閉，並返回以下格式的錯誤：

```json
{
  "type": "kick",
  "error": {
    "code": 3000,
    "message": "id does not exist"
  }
}
```

### 關閉代碼

- `1000` - 正常關閉
- `3000` - 未授權 (Unauthorized)
- `3003` - 禁止訪問 (Forbidden)
- `3008` - 超時 (Timeout)

## 消息處理

### 接收消息

```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'ack':
      console.log('收到確認:', message.data);
      break;
    case 'deviceStatus':
      console.log('設備狀態:', message.data);
      break;
    case 'errorSignal':
      console.log('錯誤信號:', message.data);
      break;
    case 'error':
      console.error('錯誤:', message.error);
      break;
    case 'kick':
      console.error('被踢出:', message.error);
      ws.close();
      break;
  }
};
```

### 發送消息

```javascript
// 發送狀態更新
ws.send(JSON.stringify({
  event: 'serviceStatus',
  data: {
    status: 'up'
  }
}));

// 發送錯誤信號
ws.send(JSON.stringify({
  event: 'serviceSignal',
  data: {
    signal: {
      msgId: 'error-001',
      content: 'Device error',
      metadata: {
        signalType: 'error',
        title: 'Error Title'
      }
    }
  }
}));
```

## 連接管理

### 重連機制

建議實現自動重連機制：

```javascript
let ws;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connect() {
  ws = new WebSocket(`wss://api.example.com/v1/ws?id=${deviceId}&token=${token}`);
  
  ws.onopen = () => {
    console.log('連接成功');
    reconnectAttempts = 0;
  };
  
  ws.onclose = (event) => {
    if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      console.log(`嘗試重連 (${reconnectAttempts}/${maxReconnectAttempts})...`);
      setTimeout(connect, 1000 * reconnectAttempts);
    }
  };
  
  ws.onerror = (error) => {
    console.error('連接錯誤:', error);
  };
}

connect();
```

### 心跳檢測

建議定期發送心跳消息以保持連接：

```javascript
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      event: 'ping',
      data: {}
    }));
  }
}, 30000); // 每 30 秒發送一次
```

## 最佳實踐

1. **錯誤處理**: 始終處理連接錯誤和消息錯誤
2. **重連機制**: 實現自動重連以處理網絡中斷
3. **心跳檢測**: 定期發送心跳以保持連接活躍
4. **消息驗證**: 驗證接收到的消息格式
5. **資源清理**: 在應用關閉時正確關閉連接

## 下一步

- [設備註冊](device-registration.md) - 透過 WebSocket 註冊設備
- [狀態更新](status-update.md) - 更新設備狀態
- [錯誤信號](error-signal.md) - 發送錯誤信號

