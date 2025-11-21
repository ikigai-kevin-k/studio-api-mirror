# 狀態枚舉參考

Studio API 使用的所有狀態枚舉值。

## 設備狀態 (Device Status)

### StudioDeviceStatusEnum

用於表示設備的基本狀態。

- `up` - 設備正常運行
- `down` - 設備離線或故障

**使用場景**:
- WebSocket `serviceStatus` 事件
- Table 狀態中的設備狀態欄位

**範例**:
```json
{
  "event": "serviceStatus",
  "data": {
    "status": "up"
  }
}
```

## 服務狀態 (Service Status)

### StudioServiceStatusEnum

用於表示服務的運行狀態。

**基本狀態**:
- `up` - 服務正常運行
- `down` - 服務停止
- `standby` - 服務待機
- `calibration` - 服務校準中
- `exception` - 服務異常

**SDP 擴展狀態** (用於 WebSocket):
- `up` - 服務正常運行
- `up_running` - 服務運行中
- `up_idle` - 服務空閒中
- `up_resume` - 服務恢復運行
- `down` - 服務停止
- `down_pause` - 服務暫停
- `down_cancel` - 服務取消

**使用場景**:
- Table 狀態中的 `sdp` 和 `idp` 欄位

**範例**:
```json
{
  "tableId": "table-001",
  "sdp": "up",
  "idp": "up"
}
```

## Table 狀態 (Table Status)

### StudioTableStatusEnum

用於表示 table 的整體狀態。

- `inactive` - Table 未激活
- `active` - Table 激活中
- `blocked` - Table 被阻塞
- `initial` - Table 初始化中

## 設備類型 (Device Type)

### StudioDeviceEnum

用於表示設備的類型。

- `Primary` - 主要設備
- `Secondary` - 備用設備

## 機器類型 (Machine Type)

### StudioMachineEnum

用於表示機器的類型。

- `roulette` - 輪盤機
- `scibo` - Scibo 機器

## 機器狀態 (Machine Status)

### StudioMachineStatusEnum

用於表示機器的狀態。

- `down` - 機器停止
- `normal` - 機器正常
- `failure` - 機器故障

## 信號類型 (Signal Type)

### ErrorSignalMetaData.signalType

用於表示錯誤信號的類型。

- `error` - 錯誤信號（嚴重問題）
- `warning` - 警告信號（非嚴重問題）

**使用場景**:
- WebSocket `serviceSignal` 事件

**範例**:
```json
{
  "event": "serviceSignal",
  "data": {
    "signal": {
      "msgId": "error-001",
      "content": "Device error",
      "metadata": {
        "signalType": "error",
        "title": "Error Title"
      }
    }
  }
}
```

## 狀態組合範例

### 完整的 Table 狀態

```json
{
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
```

### 設備狀態更新

```json
{
  "event": "serviceStatus",
  "data": {
    "status": "up"
  }
}
```

## 狀態轉換規則

### 設備狀態轉換

- `down` → `up`: 當設備從故障恢復時，系統會自動轉發 resolve signal
- `up` → `down`: 當設備故障時，系統會發布 table switch 事件

### 服務狀態轉換

- `initial` → `up`: 服務初始化完成
- `up` → `down`: 服務停止
- `up` → `standby`: 服務進入待機模式
- `up` → `calibration`: 服務進入校準模式
- `up` → `exception`: 服務發生異常

## 最佳實踐

1. **狀態一致性**: 確保發送的狀態值與實際設備狀態一致
2. **狀態轉換**: 遵循合理的狀態轉換規則
3. **狀態監控**: 定期檢查和更新狀態
4. **錯誤處理**: 當狀態異常時及時發送錯誤信號

