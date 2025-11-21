# WebSocket API - 錯誤信號

透過 WebSocket 發送設備錯誤信號，系統會自動轉發到相關服務並記錄日誌。

## 發送錯誤信號

### 事件類型

發送 `serviceSignal` 事件來報告設備錯誤。

### 消息格式

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
        "suggestion": "string",
        "timestamp": 1234567890,
        "gameCode": "string",
        "tableName": "string",
        "tableCode": "string"
      }
    }
  }
}
```

**參數說明**:
- `msgId` (string, 必需): 消息唯一識別碼
- `content` (string, 必需): 錯誤內容描述
- `metadata` (object, 必需): 錯誤元數據
  - `signalType` (string): 信號類型 (`error` 或 `warning`)
  - `title` (string, 可選): 錯誤標題
  - `description` (string, 可選): 錯誤詳細描述
  - `code` (string, 可選): 錯誤代碼
  - `suggestion` (string, 可選): 建議處理方式
  - `timestamp` (number, 可選): 時間戳（毫秒）
  - `gameCode` (string, 可選): 遊戲代碼（系統自動填充）
  - `tableName` (string, 可選): Table 名稱（系統自動填充）
  - `tableCode` (string, 可選): Table 代碼（系統自動填充）

### 範例

#### JavaScript

```javascript
// 發送錯誤信號
ws.send(JSON.stringify({
  event: 'serviceSignal',
  data: {
    signal: {
      msgId: 'error-001',
      content: 'Device connection lost',
      metadata: {
        signalType: 'error',
        title: 'Connection Error',
        description: 'The device lost connection to the server',
        code: 'CONN_001',
        suggestion: 'Check network connection and retry',
        timestamp: Date.now()
      }
    }
  }
}));

// 發送警告信號
ws.send(JSON.stringify({
  event: 'serviceSignal',
  data: {
    signal: {
      msgId: 'warning-001',
      content: 'High temperature detected',
      metadata: {
        signalType: 'warning',
        title: 'Temperature Warning',
        description: 'Device temperature is above normal range',
        code: 'TEMP_001',
        suggestion: 'Check cooling system',
        timestamp: Date.now()
      }
    }
  }
}));
```

#### Python

```python
import json
import time

error_signal = {
    "event": "serviceSignal",
    "data": {
        "signal": {
            "msgId": "error-001",
            "content": "Device connection lost",
            "metadata": {
                "signalType": "error",
                "title": "Connection Error",
                "description": "The device lost connection to the server",
                "code": "CONN_001",
                "suggestion": "Check network connection and retry",
                "timestamp": int(time.time() * 1000)
            }
        }
    }
}

await websocket.send(json.dumps(error_signal))
```

## 錯誤信號響應

### 成功響應

當錯誤信號發送成功時，會收到包含完整信號資訊的響應：

```json
{
  "type": "errorSignal",
  "data": {
    "msgId": "error-001",
    "content": "Device connection lost",
    "metadata": {
      "signalId": 12345,
      "signalType": "error",
      "title": "Connection Error",
      "description": "The device lost connection to the server",
      "code": "CONN_001",
      "suggestion": "Check network connection and retry",
      "timestamp": 1234567890,
      "gameCode": "game-001",
      "tableName": "Table 1",
      "tableCode": "table-001"
    }
  }
}
```

**注意**: 響應中的 `metadata` 會包含系統自動填充的欄位：
- `signalId`: 系統生成的信號 ID
- `gameCode`: 設備所屬的遊戲代碼
- `tableName`: 設備所屬的 table 名稱
- `tableCode`: 設備所屬的 table 代碼

### 錯誤響應

如果發送失敗，會收到錯誤消息：

```json
{
  "type": "error",
  "error": {
    "code": 400,
    "message": "Invalid signal format"
  }
}
```

## 錯誤信號處理流程

當您發送錯誤信號時，系統會自動執行以下操作：

1. **驗證信號格式**: 檢查信號數據是否有效
2. **查詢設備關聯**: 根據設備 ID 查詢所屬的 game 和 table
3. **記錄日誌**: 將錯誤信號記錄到數據庫
4. **轉發信號**: 將信號轉發到相關服務（如 LOS、Table API）
5. **發送通知**: 發送 Slack 通知（如果配置）
6. **返回響應**: 返回包含完整資訊的響應

## 信號類型

### Error (錯誤)

用於報告嚴重的設備錯誤，需要立即處理：

```javascript
ws.send(JSON.stringify({
  event: 'serviceSignal',
  data: {
    signal: {
      msgId: 'error-001',
      content: 'Critical device failure',
      metadata: {
        signalType: 'error',
        title: 'Critical Error',
        description: 'Device has encountered a critical failure',
        code: 'CRIT_001'
      }
    }
  }
}));
```

### Warning (警告)

用於報告非嚴重的問題或異常情況：

```javascript
ws.send(JSON.stringify({
  event: 'serviceSignal',
  data: {
    signal: {
      msgId: 'warning-001',
      content: 'Performance degradation',
      metadata: {
        signalType: 'warning',
        title: 'Performance Warning',
        description: 'Device performance is below expected level',
        code: 'PERF_001'
      }
    }
  }
}));
```

## 錯誤信號最佳實踐

1. **唯一 msgId**: 為每個錯誤信號使用唯一的 `msgId`，避免重複
2. **詳細描述**: 提供清晰的錯誤描述和建議處理方式
3. **時間戳**: 包含準確的時間戳以便追蹤
4. **錯誤分類**: 使用適當的 `signalType` 和 `code` 進行分類
5. **避免重複**: 不要重複發送相同的錯誤信號

## 錯誤信號查詢

您也可以透過 HTTP API 查詢歷史錯誤信號：

```bash
curl -X GET "https://api.example.com/v1/service/signal?deviceId=device-001" \
  -H "X-Service-Api-Signature: your-signature"
```

## 下一步

- [HTTP API - 狀態管理](../http/status.md) - 了解如何查詢狀態
- [參考資料 - 錯誤碼](../../reference/error-codes.md) - 查看錯誤碼列表

