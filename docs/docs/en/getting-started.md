# Getting Started

This guide will help you get started with Studio API quickly.

## Prerequisites

- HTTP client (such as curl, Postman, or any HTTP library)
- WebSocket client (for real-time communication)
- API authentication credentials (`SERVICE_API_SIGNATURE`)

## Basic Setup

### 1. Get API Endpoint

The base URL for Studio API is typically:
```
https://your-studio-api-domain.com
```

### 2. Setup Authentication

All HTTP API requests require an authentication signature in the Header:

```http
X-Service-Api-Signature: your-service-api-signature
```

### 3. WebSocket Connection

WebSocket connections require the following parameters:
- `id`: Device ID
- `token`: WebSocket authentication token

Connection URL format:
```
wss://your-studio-api-domain.com/v1/ws?id={deviceId}&token={token}
```

## Basic Flow

### 1. Register Device

First, you need to register a device via HTTP API:

```bash
curl -X POST https://your-studio-api-domain.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-signature" \
  -d '{
    "deviceId": "device-001"
  }'
```

### 2. Establish WebSocket Connection

Establish a WebSocket connection to receive real-time updates:

```javascript
const ws = new WebSocket('wss://your-studio-api-domain.com/v1/ws?id=device-001&token=your-token');
```

### 3. Update Device Status

Send status updates via WebSocket:

```javascript
ws.send(JSON.stringify({
  event: 'serviceStatus',
  data: {
    status: 'up'
  }
}));
```

### 4. Send Error Signal

Send error signals via WebSocket:

```javascript
ws.send(JSON.stringify({
  event: 'serviceSignal',
  data: {
    signal: {
      msgId: 'error-001',
      content: 'Device error occurred',
      metadata: {
        signalType: 'error',
        title: 'Device Error',
        description: 'A critical error has occurred'
      }
    }
  }
}));
```

## Next Steps

- Read [API Overview](api/overview.md) to learn about all available APIs
- Check [Example Code](examples/javascript.md) to learn more usage
- Refer to [Authentication Documentation](api/authentication.md) for detailed authentication mechanisms

