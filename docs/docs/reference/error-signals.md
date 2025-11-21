# Error Signal 列表

本頁面列出 Studio API 支持的所有 Error Signal 類型及其說明。

## 信號類型分類

Error Signal 分為兩大類：

- **Error (錯誤)**: 嚴重的設備錯誤，需要立即處理
- **Warning (警告)**: 非嚴重的問題或異常情況，需要關注但不需要立即處理

## Error Signal 列表

### 連接相關錯誤 (Connection Errors)

#### CONN_001 - 連接丟失
- **類型**: `error`
- **標題**: Connection Error
- **描述**: The device lost connection to the server
- **建議**: Check network connection and retry
- **嚴重程度**: 高

```json
{
  "msgId": "error-conn-001",
  "content": "Device connection lost",
  "metadata": {
    "signalType": "error",
    "title": "Connection Error",
    "description": "The device lost connection to the server",
    "code": "CONN_001",
    "suggestion": "Check network connection and retry"
  }
}
```

#### CONN_002 - 連接超時
- **類型**: `error`
- **標題**: Connection Timeout
- **描述**: The device connection timed out
- **建議**: Check network stability and retry connection
- **嚴重程度**: 高

#### CONN_003 - 連接不穩定
- **類型**: `warning`
- **標題**: Connection Instability
- **描述**: The device connection is unstable with frequent disconnections
- **建議**: Check network quality and signal strength
- **嚴重程度**: 中

### 設備狀態錯誤 (Device Status Errors)

#### DEV_001 - 設備離線
- **類型**: `error`
- **標題**: Device Offline
- **描述**: The device is offline or not responding
- **建議**: Check device power and network connection
- **嚴重程度**: 高

#### DEV_002 - 設備初始化失敗
- **類型**: `error`
- **標題**: Device Initialization Failed
- **描述**: The device failed to initialize properly
- **建議**: Restart the device and check system logs
- **嚴重程度**: 高

#### DEV_003 - 設備響應緩慢
- **類型**: `warning`
- **標題**: Device Slow Response
- **描述**: The device is responding slower than expected
- **建議**: Check device performance and resource usage
- **嚴重程度**: 中

### 溫度相關錯誤 (Temperature Errors)

#### TEMP_001 - 溫度過高
- **類型**: `warning`
- **標題**: High Temperature Warning
- **描述**: Device temperature is above normal range
- **建議**: Check cooling system and ensure proper ventilation
- **嚴重程度**: 中

```json
{
  "msgId": "warning-temp-001",
  "content": "High temperature detected",
  "metadata": {
    "signalType": "warning",
    "title": "Temperature Warning",
    "description": "Device temperature is above normal range",
    "code": "TEMP_001",
    "suggestion": "Check cooling system"
  }
}
```

#### TEMP_002 - 溫度過低
- **類型**: `warning`
- **標題**: Low Temperature Warning
- **描述**: Device temperature is below normal range
- **建議**: Check heating system and ambient temperature
- **嚴重程度**: 低

#### TEMP_003 - 溫度異常
- **類型**: `error`
- **標題**: Temperature Anomaly
- **描述**: Device temperature is critically outside normal range
- **建議**: Immediately check device and cooling/heating systems
- **嚴重程度**: 高

### 性能相關錯誤 (Performance Errors)

#### PERF_001 - 性能下降
- **類型**: `warning`
- **標題**: Performance Degradation
- **描述**: Device performance is below expected level
- **建議**: Check system resources and optimize performance
- **嚴重程度**: 中

```json
{
  "msgId": "warning-perf-001",
  "content": "Performance degradation",
  "metadata": {
    "signalType": "warning",
    "title": "Performance Warning",
    "description": "Device performance is below expected level",
    "code": "PERF_001",
    "suggestion": "Check system resources"
  }
}
```

#### PERF_002 - CPU 使用率過高
- **類型**: `warning`
- **標題**: High CPU Usage
- **描述**: Device CPU usage is above threshold
- **建議**: Check running processes and optimize resource usage
- **嚴重程度**: 中

#### PERF_003 - 記憶體不足
- **類型**: `error`
- **標題**: Memory Insufficient
- **描述**: Device memory usage is critically high
- **建議**: Free up memory or increase device memory capacity
- **嚴重程度**: 高

### 硬體相關錯誤 (Hardware Errors)

#### HW_001 - 硬體故障
- **類型**: `error`
- **標題**: Hardware Failure
- **描述**: A critical hardware component has failed
- **建議**: Contact support for hardware inspection and replacement
- **嚴重程度**: 高

#### HW_002 - 感測器異常
- **類型**: `error`
- **標題**: Sensor Malfunction
- **描述**: A sensor is not functioning correctly
- **建議**: Check sensor connections and calibration
- **嚴重程度**: 高

#### HW_003 - 電源異常
- **類型**: `error`
- **標題**: Power Anomaly
- **描述**: Device power supply is unstable or abnormal
- **建議**: Check power supply and connections
- **嚴重程度**: 高

### 軟體相關錯誤 (Software Errors)

#### SW_001 - 應用程式錯誤
- **類型**: `error`
- **標題**: Application Error
- **描述**: The application encountered an unexpected error
- **建議**: Check application logs and restart if necessary
- **嚴重程度**: 中

#### SW_002 - 服務異常
- **類型**: `error`
- **標題**: Service Exception
- **描述**: A critical service has stopped or is not responding
- **建議**: Restart the service and check service logs
- **嚴重程度**: 高

#### SW_003 - 配置錯誤
- **類型**: `warning`
- **標題**: Configuration Error
- **描述**: Device configuration is incorrect or missing
- **建議**: Review and update device configuration
- **嚴重程度**: 中

### 資料相關錯誤 (Data Errors)

#### DATA_001 - 資料同步失敗
- **類型**: `error`
- **標題**: Data Sync Failure
- **描述**: Failed to synchronize data with the server
- **建議**: Check network connection and retry synchronization
- **嚴重程度**: 中

#### DATA_002 - 資料損壞
- **類型**: `error`
- **標題**: Data Corruption
- **描述**: Detected corrupted data in device storage
- **建議**: Backup and restore data from backup
- **嚴重程度**: 高

#### DATA_003 - 儲存空間不足
- **類型**: `warning`
- **標題**: Storage Insufficient
- **描述**: Device storage space is running low
- **建議**: Free up storage space or expand storage capacity
- **嚴重程度**: 中

### 安全相關錯誤 (Security Errors)

#### SEC_001 - 認證失敗
- **類型**: `error`
- **標題**: Authentication Failed
- **描述**: Device authentication failed
- **建議**: Check credentials and authentication configuration
- **嚴重程度**: 高

#### SEC_002 - 未授權訪問
- **類型**: `error`
- **標題**: Unauthorized Access
- **描述**: Unauthorized access attempt detected
- **建議**: Review security logs and update access controls
- **嚴重程度**: 高

### 關鍵錯誤 (Critical Errors)

#### CRIT_001 - 關鍵系統故障
- **類型**: `error`
- **標題**: Critical System Failure
- **描述**: Device has encountered a critical failure
- **建議**: Immediately contact support for emergency assistance
- **嚴重程度**: 極高

```json
{
  "msgId": "error-crit-001",
  "content": "Critical device failure",
  "metadata": {
    "signalType": "error",
    "title": "Critical Error",
    "description": "Device has encountered a critical failure",
    "code": "CRIT_001",
    "suggestion": "Contact support immediately"
  }
}
```

#### CRIT_002 - 系統崩潰
- **類型**: `error`
- **標題**: System Crash
- **描述**: The device system has crashed
- **建議**: Restart device and check system logs
- **嚴重程度**: 極高

## 錯誤代碼命名規則

Error Signal 代碼遵循以下命名規則：

- **前綴**: 表示錯誤類別
  - `CONN_` - 連接相關
  - `DEV_` - 設備相關
  - `TEMP_` - 溫度相關
  - `PERF_` - 性能相關
  - `HW_` - 硬體相關
  - `SW_` - 軟體相關
  - `DATA_` - 資料相關
  - `SEC_` - 安全相關
  - `CRIT_` - 關鍵錯誤

- **編號**: 三位數字，從 001 開始

## 使用建議

1. **選擇適當的 signalType**
   - 使用 `error` 表示需要立即處理的嚴重問題
   - 使用 `warning` 表示需要關注但非緊急的問題

2. **提供清晰的描述**
   - `title`: 簡短的錯誤標題
   - `description`: 詳細的錯誤描述
   - `suggestion`: 具體的處理建議

3. **使用唯一的 msgId**
   - 為每個錯誤信號使用唯一的 `msgId`
   - 建議格式：`{type}-{category}-{number}`，如 `error-conn-001`

4. **包含時間戳**
   - 在 `metadata.timestamp` 中包含錯誤發生的時間
   - 使用毫秒級時間戳

## 相關文檔

- [WebSocket API - 錯誤信號](../api/websocket/error-signal.md) - 如何發送錯誤信號
- [錯誤碼參考](error-codes.md) - API 錯誤碼列表
- [WebSocket 事件](websocket-events.md) - WebSocket 事件參考

