# 錯誤碼參考

Studio API 使用的錯誤碼列表。

## HTTP 狀態碼

### 成功狀態碼

- `200 OK` - 請求成功

### 客戶端錯誤

- `400 Bad Request` - 請求參數錯誤或格式不正確
- `401 Unauthorized` - 認證失敗，API 簽名無效
- `404 Not Found` - 請求的資源不存在

### 伺服器錯誤

- `500 Internal Server Error` - 伺服器內部錯誤

## WebSocket 關閉代碼

### 標準關閉代碼

- `1000` - 正常關閉 (Normal Closure)
- `1001` - 端點離開 (Going Away)
- `1002` - 協議錯誤 (Protocol Error)
- `1003` - 不支持的數據類型 (Unsupported Data)
- `1006` - 異常關閉 (Abnormal Closure)
- `1007` - 無效的幀負載數據 (Invalid Frame Payload Data)
- `1008` - 策略違規 (Policy Violation)
- `1009` - 消息過大 (Message Too Big)
- `1011` - 內部錯誤 (Internal Error)

### 自定義關閉代碼

- `3000` - 未授權 (Unauthorized) - 認證失敗
- `3003` - 禁止訪問 (Forbidden) - 無權限訪問
- `3008` - 超時 (Timeout) - 連接超時

## 應用程式錯誤碼

### 認證錯誤

- `AUTH_001` - API 簽名缺失
- `AUTH_002` - API 簽名無效
- `AUTH_003` - WebSocket token 無效
- `AUTH_004` - 設備 ID 缺失

### 設備錯誤

- `DEVICE_001` - 設備不存在
- `DEVICE_002` - 設備 ID 格式錯誤
- `DEVICE_003` - 設備已存在

### 狀態錯誤

- `STATUS_001` - Table 不存在
- `STATUS_002` - 狀態值無效
- `STATUS_003` - 狀態更新失敗

### 信號錯誤

- `SIGNAL_001` - 信號格式錯誤
- `SIGNAL_002` - 信號 ID 缺失
- `SIGNAL_003` - 信號內容缺失

### WebSocket 錯誤

- `WS_001` - WebSocket 連接失敗
- `WS_002` - 消息格式錯誤
- `WS_003` - 事件類型無效
- `WS_004` - 數據格式錯誤

## 錯誤響應格式

### HTTP 錯誤響應

```json
{
  "ok": false,
  "error": {
    "code": 400,
    "message": "請求參數錯誤"
  }
}
```

### WebSocket 錯誤響應

```json
{
  "type": "error",
  "error": {
    "code": 400,
    "message": "請求參數錯誤"
  }
}
```

### WebSocket 踢出響應

```json
{
  "type": "kick",
  "error": {
    "code": 3000,
    "message": "認證失敗"
  }
}
```

## 錯誤處理建議

1. **檢查狀態碼**: 首先檢查 HTTP 狀態碼或 WebSocket 關閉代碼
2. **解析錯誤訊息**: 讀取錯誤訊息了解具體問題
3. **重試機制**: 對於暫時性錯誤（如 500），實現重試機制
4. **日誌記錄**: 記錄所有錯誤以便排查問題
5. **用戶提示**: 向用戶顯示友好的錯誤訊息

