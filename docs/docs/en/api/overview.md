# API Overview

Studio API provides two types of APIs: HTTP REST API and WebSocket API.

## API Types

### HTTP REST API

Used for synchronous operations such as device registration, status queries, etc.

**Base Path**: `/v1/service`

**Main Endpoints**:
- `/v1/service/device` - Device management
- `/v1/service/status` - Status management
- `/v1/service/signal` - Error signal logs

### WebSocket API

Used for real-time bidirectional communication, such as status updates, error signal sending, etc.

**Connection Endpoint**: `/v1/ws`

## Authentication

### HTTP API Authentication

All HTTP API requests require an authentication signature in the Header:

```http
X-Service-Api-Signature: your-service-api-signature
```

### WebSocket Authentication

WebSocket connections are authenticated via URL query parameters:

```
wss://domain.com/v1/ws?id={deviceId}&token={token}
```

## Response Format

### Success Response

```json
{
  "ok": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "ok": false,
  "error": {
    "code": 400,
    "message": "Error message"
  }
}
```

## Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Next Steps

- [HTTP API - Device Management](http/device.md)
- [HTTP API - Status Management](http/status.md)
- [WebSocket API - Connection Setup](websocket/connection.md)

