# WebSocket API - 狀態更新

透過 WebSocket 即時更新設備和服務狀態。

## 更新設備狀態

### 事件類型

發送 `serviceStatus` 事件來更新設備狀態。

### 消息格式

```json
{
  "event": "serviceStatus",
  "data": {
    "status": "up"
  }
}
```

**狀態值**:
- `up` - 設備正常運行
- `down` - 設備離線或故障

### 範例

#### JavaScript

```javascript
// 更新設備狀態為正常
ws.send(JSON.stringify({
  event: 'serviceStatus',
  data: {
    status: 'up'
  }
}));

// 更新設備狀態為故障
ws.send(JSON.stringify({
  event: 'serviceStatus',
  data: {
    status: 'down'
  }
}));
```

#### Python

```python
import json

# 更新設備狀態
status_update = {
    "event": "serviceStatus",
    "data": {
        "status": "up"
    }
}

await websocket.send(json.dumps(status_update))
```

## 更新 Table 狀態

### 事件類型

發送 `tableStatus` 事件來更新 table 的完整狀態。

### 消息格式

```json
{
  "event": "tableStatus",
  "data": {
    "tableId": "table-001",
    "uptime": 3600,
    "timestamp": 1234567890,
    "maintenance": false,
    "sdp": "up",
    "idp": "up",
    "broker": "up",
    "zCam": "up",
    "roulette": "up",
    "shaker": "up",
    "barcodeScanner": "up",
    "nfcScanner": "up"
  }
}
```

**參數說明**:
- `tableId` (string, 必需): table ID
- `uptime` (number, 可選): 運行時間（秒）
- `timestamp` (number, 可選): 時間戳（毫秒）
- `maintenance` (boolean, 可選): 是否在維護模式
- `sdp`, `idp` (string, 可選): 服務狀態 (`up`, `down`, `standby`, `calibration`, `exception`)
  - SDP 擴展狀態: `up_running`, `up_idle`, `up_resume`, `down_pause`, `down_cancel`
- `broker`, `zCam`, `roulette`, `shaker`, `barcodeScanner`, `nfcScanner` (string, 可選): 設備狀態 (`up`, `down`)

### 範例

#### JavaScript

```javascript
// 更新完整的 table 狀態
ws.send(JSON.stringify({
  event: 'tableStatus',
  data: {
    tableId: 'table-001',
    uptime: 3600,
    timestamp: Date.now(),
    maintenance: false,
    sdp: 'up',
    idp: 'up',
    broker: 'up',
    zCam: 'up',
    roulette: 'up',
    shaker: 'up',
    barcodeScanner: 'up',
    nfcScanner: 'up'
  }
}));

// 只更新部分狀態
ws.send(JSON.stringify({
  event: 'tableStatus',
  data: {
    tableId: 'table-001',
    broker: 'down',
    zCam: 'up'
  }
}));
```

## 狀態值說明

### 設備狀態 (status)

- `up` - 設備正常運行
- `down` - 設備離線或故障

### 服務狀態 (sdp, idp)

**基本狀態**:
- `up` - 服務正常運行
- `down` - 服務停止
- `standby` - 服務待機
- `calibration` - 服務校準中
- `exception` - 服務異常

**SDP 擴展狀態** (僅用於 SDP):
- `up` - 服務正常運行
- `up_running` - 服務運行中
- `up_idle` - 服務空閒中
- `up_resume` - 服務恢復運行
- `down` - 服務停止
- `down_pause` - 服務暫停
- `down_cancel` - 服務取消

### 設備狀態 (broker, zCam, roulette, shaker, barcodeScanner, nfcScanner)

- `up` - 設備正常
- `down` - 設備離線或故障

## 狀態更新響應

### 成功響應

當狀態更新成功時，您可能會收到確認消息：

```json
{
  "type": "ack",
  "data": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 錯誤響應

如果更新失敗，會收到錯誤消息：

```json
{
  "type": "error",
  "error": {
    "code": 400,
    "message": "Invalid status value"
  }
}
```

## 狀態更新邏輯

### 設備狀態變更觸發

當設備狀態變更時，系統會自動處理：

- **狀態變為 `up`**: 系統會自動轉發 resolve signal，清除之前的錯誤狀態
- **狀態變為 `down`**: 系統會發布 table switch 事件，觸發備用設備切換

### 範例：監聽狀態變更

```javascript
// 發送狀態更新
ws.send(JSON.stringify({
  event: 'serviceStatus',
  data: {
    status: 'down'
  }
}));

// 監聽響應
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'ack') {
    console.log('狀態更新成功');
  } else if (message.type === 'error') {
    console.error('狀態更新失敗:', message.error);
  }
};
```

## 定期狀態更新

建議定期發送狀態更新以保持系統同步：

```javascript
// 每 30 秒發送一次狀態更新
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      event: 'serviceStatus',
      data: {
        status: 'up',
        timestamp: Date.now()
      }
    }));
  }
}, 30000);
```

## 最佳實踐

1. **即時更新**: 當設備狀態變更時立即發送更新
2. **定期心跳**: 定期發送狀態更新以確認設備在線
3. **錯誤處理**: 處理狀態更新失敗的情況
4. **狀態一致性**: 確保發送的狀態值與實際設備狀態一致
5. **批量更新**: 對於多個設備，可以分別發送更新消息

## 下一步

- [錯誤信號](error-signal.md) - 學習如何發送錯誤信號
- [HTTP API - 狀態管理](../http/status.md) - 了解 HTTP API 的狀態管理功能

