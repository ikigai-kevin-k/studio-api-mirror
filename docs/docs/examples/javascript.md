# JavaScript/TypeScript 範例

完整的 JavaScript/TypeScript 整合範例。

## 完整範例

### 設備管理類別

```typescript
class StudioApiClient {
  private apiBaseUrl: string;
  private wsUrl: string;
  private apiSignature: string;
  private wsToken: string;
  private ws: WebSocket | null = null;

  constructor(
    apiBaseUrl: string,
    wsUrl: string,
    apiSignature: string,
    wsToken: string
  ) {
    this.apiBaseUrl = apiBaseUrl;
    this.wsUrl = wsUrl;
    this.apiSignature = apiSignature;
    this.wsToken = wsToken;
  }

  // 註冊設備
  async registerDevice(deviceId: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}/v1/service/device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Api-Signature': this.apiSignature
      },
      body: JSON.stringify({ deviceId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 查詢設備
  async getDevice(deviceId: string): Promise<any> {
    const response = await fetch(
      `${this.apiBaseUrl}/v1/service/device?deviceId=${deviceId}`,
      {
        headers: {
          'X-Service-Api-Signature': this.apiSignature
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 更新設備
  async updateDevice(deviceId: string, tableId: string): Promise<any> {
    const response = await fetch(`${this.apiBaseUrl}/v1/service/device`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Api-Signature': this.apiSignature
      },
      body: JSON.stringify({ deviceId, tableId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 建立 WebSocket 連接
  connectWebSocket(deviceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${this.wsUrl}/v1/ws?id=${deviceId}&token=${this.wsToken}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket 連接已建立');
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 錯誤:', error);
        reject(error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket 連接已關閉', event.code, event.reason);
        this.ws = null;
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      };
    });
  }

  // 處理 WebSocket 消息
  private handleMessage(message: any) {
    switch (message.type) {
      case 'ack':
        console.log('收到確認:', message.data);
        break;
      case 'deviceStatus':
        console.log('設備狀態:', message.data);
        break;
      case 'errorSignal':
        console.log('錯誤信號:', message.data);
        break;
      case 'error':
        console.error('錯誤:', message.error);
        break;
      case 'kick':
        console.error('被踢出:', message.error);
        this.ws?.close();
        break;
    }
  }

  // 更新設備狀態
  updateDeviceStatus(status: 'up' | 'down') {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未連接');
    }

    this.ws.send(JSON.stringify({
      event: 'serviceStatus',
      data: { status }
    }));
  }

  // 更新 Table 狀態（包含新的 SDP 狀態值）
  updateTableStatus(tableId: string, status: {
    sdp?: 'up' | 'up_running' | 'up_idle' | 'up_resume' | 'down' | 'down_pause' | 'down_cancel' | 'standby' | 'calibration' | 'exception';
    idp?: 'up' | 'down' | 'standby' | 'calibration' | 'exception';
    broker?: 'up' | 'down';
    zCam?: 'up' | 'down';
    roulette?: 'up' | 'down';
    shaker?: 'up' | 'down';
    barcodeScanner?: 'up' | 'down';
    nfcScanner?: 'up' | 'down';
    maintenance?: boolean;
    uptime?: number;
  }) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未連接');
    }

    this.ws.send(JSON.stringify({
      event: 'tableStatus',
      data: {
        tableId,
        ...status,
        timestamp: Date.now()
      }
    }));
  }

  // 更新 SDP 狀態（使用新的擴展狀態值）
  updateSdpStatus(tableId: string, sdpStatus: 'up_running' | 'up_idle' | 'up_resume' | 'down_pause' | 'down_cancel') {
    this.updateTableStatus(tableId, { sdp: sdpStatus });
  }

  // 發送錯誤信號
  sendErrorSignal(signal: {
    msgId: string;
    content: string;
    metadata: {
      signalType: 'error' | 'warning';
      title?: string;
      description?: string;
      code?: string;
      suggestion?: string;
    };
  }) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未連接');
    }

    this.ws.send(JSON.stringify({
      event: 'serviceSignal',
      data: {
        signal: {
          ...signal,
          metadata: {
            ...signal.metadata,
            timestamp: Date.now()
          }
        }
      }
    }));
  }

  // 關閉連接
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

### 使用範例

```typescript
// 初始化客戶端
const client = new StudioApiClient(
  'https://api.example.com',
  'wss://api.example.com',
  'your-api-signature',
  'your-ws-token'
);

// 註冊設備
try {
  const result = await client.registerDevice('device-001');
  console.log('設備註冊成功:', result);
} catch (error) {
  console.error('設備註冊失敗:', error);
}

// 建立 WebSocket 連接
try {
  await client.connectWebSocket('device-001');
  console.log('WebSocket 連接成功');
} catch (error) {
  console.error('WebSocket 連接失敗:', error);
}

// 更新設備狀態
client.updateDeviceStatus('up');

// 更新 SDP 狀態為運行中
client.updateSdpStatus('ARO-001-2', 'up_running');

// 更新 SDP 狀態為暫停
client.updateSdpStatus('ARO-001-2', 'down_pause');

// 更新完整的 Table 狀態
client.updateTableStatus('ARO-001-2', {
  sdp: 'up_running',
  idp: 'up',
  broker: 'up',
  zCam: 'up',
  maintenance: false
});

// 發送錯誤信號
client.sendErrorSignal({
  msgId: 'error-001',
  content: 'Device connection lost',
  metadata: {
    signalType: 'error',
    title: 'Connection Error',
    description: 'The device lost connection to the server',
    code: 'CONN_001',
    suggestion: 'Check network connection and retry'
  }
});

// 應用關閉時斷開連接
process.on('SIGINT', () => {
  client.disconnect();
  process.exit();
});
```

## 重連機制

```typescript
class StudioApiClientWithReconnect extends StudioApiClient {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private deviceId: string = '';

  async connectWebSocket(deviceId: string): Promise<void> {
    this.deviceId = deviceId;
    await super.connectWebSocket(deviceId);
    
    // 監聽關閉事件以實現重連
    if (this.ws) {
      this.ws.onclose = (event) => {
        console.log('WebSocket 連接已關閉', event.code, event.reason);
        this.ws = null;
        
        // 如果不是正常關閉，嘗試重連
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * this.reconnectAttempts;
          console.log(`嘗試重連 (${this.reconnectAttempts}/${this.maxReconnectAttempts})，${delay}ms 後重試...`);
          
          setTimeout(() => {
            this.connectWebSocket(this.deviceId).catch(console.error);
          }, delay);
        }
      };
    }
  }
}
```

## 心跳檢測

```typescript
class StudioApiClientWithHeartbeat extends StudioApiClient {
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatIntervalMs = 30000; // 30 秒

  async connectWebSocket(deviceId: string): Promise<void> {
    await super.connectWebSocket(deviceId);
    
    // 啟動心跳
    this.startHeartbeat();
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.updateDeviceStatus('up');
      }
    }, this.heartbeatIntervalMs);
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    super.disconnect();
  }
}
```

## 錯誤處理

```typescript
class StudioApiClientWithErrorHandling extends StudioApiClient {
  private errorHandlers: Map<string, (error: any) => void> = new Map();

  onError(errorType: string, handler: (error: any) => void) {
    this.errorHandlers.set(errorType, handler);
  }

  private handleMessage(message: any) {
    super.handleMessage(message);

    if (message.type === 'error' && this.errorHandlers.has('error')) {
      this.errorHandlers.get('error')!(message.error);
    }

    if (message.type === 'kick' && this.errorHandlers.has('kick')) {
      this.errorHandlers.get('kick')!(message.error);
    }
  }
}

// 使用範例
const client = new StudioApiClientWithErrorHandling(...);

client.onError('error', (error) => {
  console.error('收到錯誤:', error);
  // 處理錯誤邏輯
});

client.onError('kick', (error) => {
  console.error('被踢出:', error);
  // 處理被踢出邏輯，可能需要重新認證
});
```

