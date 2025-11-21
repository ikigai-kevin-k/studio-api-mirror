# WebSocket 事件參考

Studio API WebSocket 支持的所有事件類型。

## 發送到伺服器的事件

### serviceStatus

更新設備狀態。

**事件格式**:
```json
{
  "event": "serviceStatus",
  "data": {
    "status": "up"
  }
}
```

**參數**:
- `status` (string, 必需): 設備狀態 (`up` 或 `down`)

**響應**:
- 成功: `ack` 類型消息
- 失敗: `error` 類型消息

### serviceSignal

發送錯誤信號。

**事件格式**:
```json
{
  "event": "serviceSignal",
  "data": {
    "signal": {
      "msgId": "string",
      "content": "string",
      "metadata": {
        "signalType": "error",
        "title": "string",
        "description": "string",
        "code": "string",
        "suggestion": "string"
      }
    }
  }
}
```

**參數**:
- `signal.msgId` (string, 必需): 消息唯一識別碼
- `signal.content` (string, 必需): 錯誤內容
- `signal.metadata` (object, 必需): 錯誤元數據
  - `signalType` (string): 信號類型 (`error` 或 `warning`)
  - `title` (string, 可選): 錯誤標題
  - `description` (string, 可選): 錯誤描述
  - `code` (string, 可選): 錯誤代碼
  - `suggestion` (string, 可選): 建議處理方式

**響應**:
- 成功: `errorSignal` 類型消息，包含完整的信號資訊
- 失敗: `error` 類型消息

### tableStatus

更新 table 狀態。

**事件格式**:
```json
{
  "event": "tableStatus",
  "data": {
    "tableId": "string",
    "uptime": 0,
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

**參數**:
- `tableId` (string, 必需): table ID
- 其他參數為可選，用於更新對應的狀態欄位

**響應**:
- 成功: `ack` 類型消息
- 失敗: `error` 類型消息

## 從伺服器接收的事件

### ack

確認消息。

**消息格式**:
```json
{
  "type": "ack",
  "data": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**觸發時機**:
- 成功處理 `serviceStatus` 事件
- 成功處理 `tableStatus` 事件

### deviceStatus

設備狀態響應。

**消息格式**:
```json
{
  "type": "deviceStatus",
  "data": {
    "deviceId": "string",
    "status": "up",
    "resolves": [12345, 12346]
  }
}
```

**觸發時機**:
- 設備狀態變更時
- 查詢設備狀態時

### errorSignal

錯誤信號響應。

**消息格式**:
```json
{
  "type": "errorSignal",
  "data": {
    "msgId": "string",
    "content": "string",
    "metadata": {
      "signalId": 12345,
      "signalType": "error",
      "title": "string",
      "description": "string",
      "code": "string",
      "suggestion": "string",
      "timestamp": 1234567890,
      "gameCode": "string",
      "tableName": "string",
      "tableCode": "string"
    }
  }
}
```

**觸發時機**:
- 成功處理 `serviceSignal` 事件後

**注意**: 響應中的 `metadata` 會包含系統自動填充的欄位。

### activateBackup

備份激活響應。

**消息格式**:
```json
{
  "type": "activateBackup",
  "data": {}
}
```

**觸發時機**:
- 當需要激活備用設備時

### error

錯誤消息。

**消息格式**:
```json
{
  "type": "error",
  "error": {
    "code": 400,
    "message": "錯誤訊息"
  }
}
```

**觸發時機**:
- 處理事件時發生錯誤
- 消息格式錯誤
- 參數驗證失敗

### kick

被踢出連接。

**消息格式**:
```json
{
  "type": "kick",
  "error": {
    "code": 3000,
    "message": "認證失敗"
  }
}
```

**觸發時機**:
- 認證失敗
- 無權限訪問
- 連接超時

**注意**: 收到 `kick` 消息後，WebSocket 連接會立即關閉。

## 系統事件

### connection

連接建立事件（內部使用）。

**觸發時機**:
- WebSocket 連接成功建立時

### close

連接關閉事件（內部使用）。

**觸發時機**:
- WebSocket 連接關閉時

## 事件處理流程

### 狀態更新流程

1. 客戶端發送 `serviceStatus` 事件
2. 伺服器處理狀態更新
3. 伺服器返回 `ack` 確認消息
4. 如果狀態變更觸發其他操作，可能收到 `deviceStatus` 消息

### 錯誤信號流程

1. 客戶端發送 `serviceSignal` 事件
2. 伺服器驗證並處理信號
3. 伺服器記錄日誌並轉發信號
4. 伺服器返回 `errorSignal` 響應，包含完整的信號資訊

## 最佳實踐

1. **事件驗證**: 發送事件前驗證數據格式
2. **錯誤處理**: 處理所有可能的錯誤響應
3. **狀態同步**: 確保發送的狀態與實際狀態一致
4. **消息追蹤**: 使用唯一的 `msgId` 追蹤消息
5. **重試機制**: 對於失敗的事件實現重試機制

