# HTTP API - 設備管理

設備管理 API 用於註冊、查詢和更新設備資訊。

## 註冊設備

註冊一個新設備到系統中。

### 端點

```
POST /v1/service/device
```

### 請求頭

```http
Content-Type: application/json
X-Service-Api-Signature: your-service-api-signature
```

### 請求體

```json
{
  "deviceId": "string"
}
```

**參數說明**:
- `deviceId` (string, 必需): 設備的唯一識別碼，長度 1-255 字元

### 響應

**成功響應 (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "deviceId": "device-001",
    "tableId": "table-001"
  }
}
```

**錯誤響應**:
- `400 Bad Request` - 請求參數錯誤
- `401 Unauthorized` - 認證失敗

### 範例

#### cURL

```bash
curl -X POST https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-signature" \
  -d '{
    "deviceId": "device-001"
  }'
```

#### JavaScript

```javascript
const response = await fetch('https://api.example.com/v1/service/device', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Service-Api-Signature': 'your-signature'
  },
  body: JSON.stringify({
    deviceId: 'device-001'
  })
});

const data = await response.json();
console.log(data);
```

## 查詢設備

查詢指定設備的資訊。

### 端點

```
GET /v1/service/device?deviceId={deviceId}
```

### 請求頭

```http
X-Service-Api-Signature: your-service-api-signature
```

### 查詢參數

- `deviceId` (string, 必需): 要查詢的設備 ID

### 響應

**成功響應 (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "deviceId": "device-001",
    "tableId": "table-001"
  }
}
```

**錯誤響應**:
- `400 Bad Request` - 請求參數錯誤
- `401 Unauthorized` - 認證失敗
- `404 Not Found` - 設備不存在

### 範例

#### cURL

```bash
curl -X GET "https://api.example.com/v1/service/device?deviceId=device-001" \
  -H "X-Service-Api-Signature: your-signature"
```

#### JavaScript

```javascript
const deviceId = 'device-001';
const response = await fetch(
  `https://api.example.com/v1/service/device?deviceId=${deviceId}`,
  {
    headers: {
      'X-Service-Api-Signature': 'your-signature'
    }
  }
);

const data = await response.json();
console.log(data);
```

## 更新設備

更新設備的關聯資訊（如關聯的 table）。

### 端點

```
PATCH /v1/service/device
```

### 請求頭

```http
Content-Type: application/json
X-Service-Api-Signature: your-service-api-signature
```

### 請求體

```json
{
  "deviceId": "string",
  "tableId": "string"
}
```

**參數說明**:
- `deviceId` (string, 必需): 設備 ID
- `tableId` (string, 必需): 要關聯的 table ID

### 響應

**成功響應 (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "deviceId": "device-001",
    "tableId": "table-002"
  }
}
```

**錯誤響應**:
- `400 Bad Request` - 請求參數錯誤
- `401 Unauthorized` - 認證失敗
- `404 Not Found` - 設備不存在

### 範例

#### cURL

```bash
curl -X PATCH https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-signature" \
  -d '{
    "deviceId": "device-001",
    "tableId": "table-002"
  }'
```

#### JavaScript

```javascript
const response = await fetch('https://api.example.com/v1/service/device', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'X-Service-Api-Signature': 'your-signature'
  },
  body: JSON.stringify({
    deviceId: 'device-001',
    tableId: 'table-002'
  })
});

const data = await response.json();
console.log(data);
```

## 使用場景

1. **設備初始化**: 當新設備首次連接到系統時，使用註冊 API
2. **設備查詢**: 查詢設備當前關聯的 table 資訊
3. **設備遷移**: 當設備需要切換到不同的 table 時，使用更新 API

## 注意事項

- 設備 ID 必須是唯一的
- 更新設備時，必須提供完整的 `deviceId` 和 `tableId`
- 所有請求都需要有效的認證簽名

