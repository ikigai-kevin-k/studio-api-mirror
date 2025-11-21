# cURL 範例

使用 cURL 命令測試 Studio API 的範例。

## 設備管理

### 註冊設備

```bash
curl -X POST https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{
    "deviceId": "device-001"
  }'
```

### 查詢設備

```bash
curl -X GET "https://api.example.com/v1/service/device?deviceId=device-001" \
  -H "X-Service-Api-Signature: your-service-api-signature"
```

### 更新設備

```bash
curl -X PATCH https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{
    "deviceId": "device-001",
    "tableId": "table-001"
  }'
```

## 狀態管理

### 查詢 Table 狀態

```bash
curl -X GET "https://api.example.com/v1/service/status?tableId=table-001" \
  -H "X-Service-Api-Signature: your-service-api-signature"
```

### 創建 Table 狀態

```bash
curl -X POST https://api.example.com/v1/service/status \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{
    "tableId": "table-001"
  }'
```

### 更新 Table 狀態

```bash
curl -X PATCH https://api.example.com/v1/service/status \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{
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
  }'
```

## 錯誤信號日誌

### 查詢錯誤信號日誌

```bash
curl -X GET "https://api.example.com/v1/service/signal?deviceId=device-001" \
  -H "X-Service-Api-Signature: your-service-api-signature"
```

## 使用環境變數

為了方便管理，可以使用環境變數：

```bash
# 設置環境變數
export API_BASE_URL="https://api.example.com"
export API_SIGNATURE="your-service-api-signature"
export DEVICE_ID="device-001"
export TABLE_ID="table-001"

# 使用環境變數
curl -X POST "${API_BASE_URL}/v1/service/device" \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: ${API_SIGNATURE}" \
  -d "{
    \"deviceId\": \"${DEVICE_ID}\"
  }"
```

## 格式化輸出

使用 `jq` 格式化 JSON 輸出：

```bash
curl -X GET "https://api.example.com/v1/service/device?deviceId=device-001" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  | jq '.'
```

## 詳細輸出

使用 `-v` 選項查看詳細的請求/響應資訊：

```bash
curl -v -X POST https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{
    "deviceId": "device-001"
  }'
```

## 錯誤處理

檢查 HTTP 狀態碼：

```bash
response=$(curl -s -w "\n%{http_code}" -X POST https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{
    "deviceId": "device-001"
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
  echo "成功: $body"
else
  echo "失敗 (HTTP $http_code): $body"
fi
```

## 批次操作

使用 shell 腳本進行批次操作：

```bash
#!/bin/bash

API_BASE_URL="https://api.example.com"
API_SIGNATURE="your-service-api-signature"

# 註冊多個設備
for i in {1..5}; do
  device_id="device-00${i}"
  echo "註冊設備: $device_id"
  
  curl -X POST "${API_BASE_URL}/v1/service/device" \
    -H "Content-Type: application/json" \
    -H "X-Service-Api-Signature: ${API_SIGNATURE}" \
    -d "{
      \"deviceId\": \"${device_id}\"
    }"
  
  echo ""
  sleep 1
done
```

## 注意事項

1. **認證**: 所有請求都必須包含 `X-Service-Api-Signature` header
2. **Content-Type**: POST 和 PATCH 請求必須設置 `Content-Type: application/json`
3. **HTTPS**: 生產環境請使用 HTTPS
4. **錯誤處理**: 檢查 HTTP 狀態碼和響應內容
5. **WebSocket**: cURL 不支援 WebSocket，請使用其他工具或程式語言

