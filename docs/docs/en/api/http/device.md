# HTTP API - Device Management

Device management API is used to register, query, and update device information.

## Register Device

Register a new device to the system.

### Endpoint

```
POST /v1/service/device
```

### Request Headers

```http
Content-Type: application/json
X-Service-Api-Signature: your-service-api-signature
```

### Request Body

```json
{
  "deviceId": "string"
}
```

**Parameters**:
- `deviceId` (string, required): Unique device identifier, 1-255 characters

### Response

**Success Response (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "deviceId": "device-001",
    "tableId": "table-001"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication failed

### Examples

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

## Query Device

Query information for a specific device.

### Endpoint

```
GET /v1/service/device?deviceId={deviceId}
```

### Request Headers

```http
X-Service-Api-Signature: your-service-api-signature
```

### Query Parameters

- `deviceId` (string, required): Device ID to query

### Response

**Success Response (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "deviceId": "device-001",
    "tableId": "table-001"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Device does not exist

### Examples

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

## Update Device

Update device association information (such as associated table).

### Endpoint

```
PATCH /v1/service/device
```

### Request Headers

```http
Content-Type: application/json
X-Service-Api-Signature: your-service-api-signature
```

### Request Body

```json
{
  "deviceId": "string",
  "tableId": "string"
}
```

**Parameters**:
- `deviceId` (string, required): Device ID
- `tableId` (string, required): Table ID to associate

### Response

**Success Response (200 OK)**:
```json
{
  "ok": true,
  "data": {
    "deviceId": "device-001",
    "tableId": "table-002"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Device does not exist

### Examples

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

## Use Cases

1. **Device Initialization**: Use the registration API when a new device first connects to the system
2. **Device Query**: Query the current table information associated with a device
3. **Device Migration**: Use the update API when a device needs to switch to a different table

## Notes

- Device ID must be unique
- When updating a device, both `deviceId` and `tableId` must be provided
- All requests require a valid authentication signature
