# HTTP API - 狀態管理

狀態管理 API 用於查詢和更新設備及 table 的狀態資訊。

## 查詢 Table 狀態

查詢指定 table 的當前狀態。

### 端點

```
GET /v1/service/status?tableId={tableId}
```

### 請求頭

```http
X-Service-Api-Signature: your-service-api-signature
```

### 查詢參數

- `tableId` (string, 必需): 要查詢的 table ID

### 響應

**成功響應 (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "tableId": "table-001",
    "uptime": 1234567890,
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

**狀態值說明**:
- `sdp`, `idp`: 服務狀態 (`up`, `down`, `standby`, `calibration`, `exception`)
  - SDP 擴展狀態 (WebSocket 專用): `up_running`, `up_idle`, `up_resume`, `down_pause`, `down_cancel`
- `broker`, `zCam`, `roulette`, `shaker`, `barcodeScanner`, `nfcScanner`: 設備狀態 (`up`, `down`)

### 範例

#### cURL

```bash
curl -X GET "https://api.example.com/v1/service/status?tableId=table-001" \
  -H "X-Service-Api-Signature: your-signature"
```

#### JavaScript

```javascript
const tableId = 'table-001';
const response = await fetch(
  `https://api.example.com/v1/service/status?tableId=${tableId}`,
  {
    headers: {
      'X-Service-Api-Signature': 'your-signature'
    }
  }
);

const data = await response.json();
console.log(data);
```

## 創建 Table 狀態

為指定的 table 創建初始狀態記錄。

### 端點

```
POST /v1/service/status
```

### 請求頭

```http
Content-Type: application/json
X-Service-Api-Signature: your-service-api-signature
```

### 請求體

```json
{
  "tableId": "string"
}
```

**參數說明**:
- `tableId` (string, 必需): table ID

### 響應

**成功響應 (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "tableId": "table-001",
    "uptime": 0,
    "timestamp": 1234567890,
    "maintenance": false,
    "sdp": "initial",
    "idp": "initial",
    "broker": "down",
    "zCam": "down",
    "roulette": "down",
    "shaker": "down",
    "barcodeScanner": "down",
    "nfcScanner": "down"
  }
}
```

### 範例

#### cURL

```bash
curl -X POST https://api.example.com/v1/service/status \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-signature" \
  -d '{
    "tableId": "table-001"
  }'
```

## 更新 Table 狀態

更新指定 table 的狀態資訊。

### 端點

```
PATCH /v1/service/status
```

### 請求頭

```http
Content-Type: application/json
X-Service-Api-Signature: your-service-api-signature
```

### 請求體

```json
{
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
```

**參數說明**:
- `tableId` (string, 必需): table ID
- `uptime` (number, 可選): 運行時間（秒）
- `timestamp` (number, 可選): 時間戳（毫秒）
- `maintenance` (boolean, 可選): 是否在維護模式
- `sdp`, `idp` (string, 可選): 服務狀態 (`up`, `down`, `standby`, `calibration`, `exception`)
  - SDP 擴展狀態 (WebSocket 專用): `up_running`, `up_idle`, `up_resume`, `down_pause`, `down_cancel`
- `broker`, `zCam`, `roulette`, `shaker`, `barcodeScanner`, `nfcScanner` (string, 可選): 設備狀態 (`up`, `down`)

### 響應

**成功響應 (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "tableId": "table-001",
    "uptime": 1234567890,
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

### 範例

#### cURL

```bash
curl -X PATCH https://api.example.com/v1/service/status \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-signature" \
  -d '{
    "tableId": "table-001",
    "uptime": 3600,
    "timestamp": 1234567890,
    "maintenance": false,
    "sdp": "up",
    "idp": "up",
    "broker": "up",
    "zCam": "up"
  }'
```

#### JavaScript

```javascript
const response = await fetch('https://api.example.com/v1/service/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'X-Service-Api-Signature': 'your-signature'
  },
  body: JSON.stringify({
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
  })
});

const data = await response.json();
console.log(data);
```

## 狀態值說明

### 服務狀態 (sdp, idp)

**基本狀態**:
- `up` - 服務正常運行
- `down` - 服務停止
- `standby` - 服務待機
- `calibration` - 服務校準中
- `exception` - 服務異常

**SDP 擴展狀態** (僅用於 WebSocket):
- `up_running` - 服務運行中
- `up_idle` - 服務空閒中
- `up_resume` - 服務恢復運行
- `down_pause` - 服務暫停
- `down_cancel` - 服務取消

### 設備狀態 (broker, zCam, roulette, shaker, barcodeScanner, nfcScanner)

- `up` - 設備正常
- `down` - 設備離線或故障

## 使用場景

1. **狀態查詢**: 定期查詢 table 狀態以監控設備健康狀況
2. **狀態初始化**: 當新 table 上線時創建初始狀態記錄
3. **狀態更新**: 當設備狀態變更時更新狀態資訊

## 注意事項

- 更新狀態時，只有提供的欄位會被更新
- 狀態值必須符合定義的枚舉值
- 建議使用 WebSocket API 進行即時狀態更新，HTTP API 用於查詢和批量更新

