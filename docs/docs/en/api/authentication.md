# Authentication

Studio API uses two authentication methods: HTTP API signature authentication and WebSocket token authentication.

## HTTP API Authentication

### Authentication Method

All HTTP API requests must include a service API signature in the Header:

```http
X-Service-Api-Signature: your-service-api-signature
```

### Example

```bash
curl -X POST https://api.example.com/v1/service/device \
  -H "Content-Type: application/json" \
  -H "X-Service-Api-Signature: your-service-api-signature" \
  -d '{"deviceId": "device-001"}'
```

### JavaScript Example

```javascript
const response = await fetch('https://api.example.com/v1/service/device', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Service-Api-Signature': 'your-service-api-signature'
  },
  body: JSON.stringify({
    deviceId: 'device-001'
  })
});
```

### Python Example

```python
import requests

headers = {
    'Content-Type': 'application/json',
    'X-Service-Api-Signature': 'your-service-api-signature'
}

response = requests.post(
    'https://api.example.com/v1/service/device',
    headers=headers,
    json={'deviceId': 'device-001'}
)
```

## WebSocket Authentication

### Authentication Method

WebSocket connections are authenticated via URL query parameters:

```
wss://api.example.com/v1/ws?id={deviceId}&token={token}
```

### Required Parameters

- `id` (required): Device ID
- `token` (required): WebSocket authentication token

### Connection Example

```javascript
const deviceId = 'device-001';
const token = 'your-websocket-token';
const ws = new WebSocket(
  `wss://api.example.com/v1/ws?id=${deviceId}&token=${token}`
);
```

### Authentication Failure

If authentication fails, the WebSocket connection will be immediately closed and return an error message in the following format:

```json
{
  "type": "kick",
  "error": {
    "code": 3000,
    "message": "Authentication error message"
  }
}
```

### Close Codes

- `3000` - Unauthorized
- `3003` - Forbidden

## Security Recommendations

1. **Protect Your Signatures and Tokens**
   - Do not commit authentication credentials to version control systems
   - Use environment variables or secure configuration management systems

2. **Use HTTPS/WSS**
   - All API requests should be made over encrypted connections
   - Avoid using HTTP/WS in production environments

3. **Rotate Credentials Regularly**
   - Regularly update your API signatures and WebSocket tokens
   - Replace immediately if credentials are compromised

## Next Steps

- [HTTP API - Device Management](http/device.md)
- [WebSocket API - Connection Setup](websocket/connection.md)

