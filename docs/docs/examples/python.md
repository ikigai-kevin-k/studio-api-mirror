# Python 範例

完整的 Python 整合範例。

## 完整範例

### 設備管理類別

```python
import asyncio
import websockets
import json
import aiohttp
from typing import Optional, Dict, Any

class StudioApiClient:
    def __init__(
        self,
        api_base_url: str,
        ws_url: str,
        api_signature: str,
        ws_token: str
    ):
        self.api_base_url = api_base_url
        self.ws_url = ws_url
        self.api_signature = api_signature
        self.ws_token = ws_token
        self.ws: Optional[websockets.WebSocketServerProtocol] = None

    # 註冊設備
    async def register_device(self, device_id: str) -> Dict[str, Any]:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f'{self.api_base_url}/v1/service/device',
                headers={
                    'Content-Type': 'application/json',
                    'X-Service-Api-Signature': self.api_signature
                },
                json={'deviceId': device_id}
            ) as response:
                if response.status != 200:
                    raise Exception(f'HTTP error! status: {response.status}')
                return await response.json()

    # 查詢設備
    async def get_device(self, device_id: str) -> Dict[str, Any]:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f'{self.api_base_url}/v1/service/device?deviceId={device_id}',
                headers={
                    'X-Service-Api-Signature': self.api_signature
                }
            ) as response:
                if response.status != 200:
                    raise Exception(f'HTTP error! status: {response.status}')
                return await response.json()

    # 更新設備
    async def update_device(
        self,
        device_id: str,
        table_id: str
    ) -> Dict[str, Any]:
        async with aiohttp.ClientSession() as session:
            async with session.patch(
                f'{self.api_base_url}/v1/service/device',
                headers={
                    'Content-Type': 'application/json',
                    'X-Service-Api-Signature': self.api_signature
                },
                json={'deviceId': device_id, 'tableId': table_id}
            ) as response:
                if response.status != 200:
                    raise Exception(f'HTTP error! status: {response.status}')
                return await response.json()

    # 建立 WebSocket 連接
    async def connect_websocket(self, device_id: str):
        uri = f'{self.ws_url}/v1/ws?id={device_id}&token={self.ws_token}'
        self.ws = await websockets.connect(uri)
        print(f'WebSocket 連接已建立: {device_id}')

    # 處理 WebSocket 消息
    async def handle_message(self, message: Dict[str, Any]):
        msg_type = message.get('type')
        
        if msg_type == 'ack':
            print('收到確認:', message.get('data'))
        elif msg_type == 'deviceStatus':
            print('設備狀態:', message.get('data'))
        elif msg_type == 'errorSignal':
            print('錯誤信號:', message.get('data'))
        elif msg_type == 'error':
            print('錯誤:', message.get('error'))
        elif msg_type == 'kick':
            print('被踢出:', message.get('error'))
            await self.disconnect()

    # 監聽消息
    async def listen_messages(self):
        if not self.ws:
            raise Exception('WebSocket 未連接')
        
        async for message in self.ws:
            try:
                data = json.loads(message)
                await self.handle_message(data)
            except json.JSONDecodeError:
                print(f'無法解析消息: {message}')

    # 更新設備狀態
    async def update_device_status(self, status: str):
        if not self.ws:
            raise Exception('WebSocket 未連接')
        
        message = {
            'event': 'serviceStatus',
            'data': {'status': status}
        }
        await self.ws.send(json.dumps(message))

    # 發送錯誤信號
    async def send_error_signal(
        self,
        msg_id: str,
        content: str,
        metadata: Dict[str, Any]
    ):
        if not self.ws:
            raise Exception('WebSocket 未連接')
        
        message = {
            'event': 'serviceSignal',
            'data': {
                'signal': {
                    'msgId': msg_id,
                    'content': content,
                    'metadata': {
                        **metadata,
                        'timestamp': int(asyncio.get_event_loop().time() * 1000)
                    }
                }
            }
        }
        await self.ws.send(json.dumps(message))

    # 關閉連接
    async def disconnect(self):
        if self.ws:
            await self.ws.close()
            self.ws = None
            print('WebSocket 連接已關閉')
```

### 使用範例

```python
async def main():
    # 初始化客戶端
    client = StudioApiClient(
        api_base_url='https://api.example.com',
        ws_url='wss://api.example.com',
        api_signature='your-api-signature',
        ws_token='your-ws-token'
    )

    try:
        # 註冊設備
        result = await client.register_device('device-001')
        print('設備註冊成功:', result)

        # 建立 WebSocket 連接
        await client.connect_websocket('device-001')
        print('WebSocket 連接成功')

        # 啟動消息監聽（在背景執行）
        listen_task = asyncio.create_task(client.listen_messages())

        # 更新設備狀態
        await client.update_device_status('up')

        # 發送錯誤信號
        await client.send_error_signal(
            msg_id='error-001',
            content='Device connection lost',
            metadata={
                'signalType': 'error',
                'title': 'Connection Error',
                'description': 'The device lost connection to the server',
                'code': 'CONN_001',
                'suggestion': 'Check network connection and retry'
            }
        )

        # 保持連接
        await asyncio.sleep(60)

        # 關閉連接
        await client.disconnect()
        listen_task.cancel()

    except Exception as e:
        print(f'錯誤: {e}')
        await client.disconnect()

if __name__ == '__main__':
    asyncio.run(main())
```

## 重連機制

```python
class StudioApiClientWithReconnect(StudioApiClient):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.reconnect_attempts = 0
        self.max_reconnect_attempts = 5
        self.reconnect_delay = 1.0
        self.device_id = ''

    async def connect_websocket(self, device_id: str):
        self.device_id = device_id
        
        while self.reconnect_attempts < self.max_reconnect_attempts:
            try:
                await super().connect_websocket(device_id)
                self.reconnect_attempts = 0
                return
            except Exception as e:
                self.reconnect_attempts += 1
                if self.reconnect_attempts >= self.max_reconnect_attempts:
                    raise e
                
                delay = self.reconnect_delay * self.reconnect_attempts
                print(f'連接失敗，{delay} 秒後重試 ({self.reconnect_attempts}/{self.max_reconnect_attempts})...')
                await asyncio.sleep(delay)
```

## 心跳檢測

```python
class StudioApiClientWithHeartbeat(StudioApiClient):
    def __init__(self, *args, heartbeat_interval: float = 30.0, **kwargs):
        super().__init__(*args, **kwargs)
        self.heartbeat_interval = heartbeat_interval
        self.heartbeat_task: Optional[asyncio.Task] = None

    async def connect_websocket(self, device_id: str):
        await super().connect_websocket(device_id)
        self.start_heartbeat()

    def start_heartbeat(self):
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
        
        async def heartbeat():
            while True:
                try:
                    await asyncio.sleep(self.heartbeat_interval)
                    if self.ws:
                        await self.update_device_status('up')
                except asyncio.CancelledError:
                    break
                except Exception as e:
                    print(f'心跳錯誤: {e}')
        
        self.heartbeat_task = asyncio.create_task(heartbeat())

    async def disconnect(self):
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
        await super().disconnect()
```

## 錯誤處理

```python
class StudioApiClientWithErrorHandling(StudioApiClient):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.error_handlers: Dict[str, callable] = {}

    def on_error(self, error_type: str, handler: callable):
        self.error_handlers[error_type] = handler

    async def handle_message(self, message: Dict[str, Any]):
        await super().handle_message(message)

        msg_type = message.get('type')
        if msg_type == 'error' and 'error' in self.error_handlers:
            self.error_handlers['error'](message.get('error'))
        
        if msg_type == 'kick' and 'kick' in self.error_handlers:
            self.error_handlers['kick'](message.get('error'))

# 使用範例
client = StudioApiClientWithErrorHandling(...)

def handle_error(error):
    print(f'收到錯誤: {error}')

def handle_kick(error):
    print(f'被踢出: {error}')

client.on_error('error', handle_error)
client.on_error('kick', handle_kick)
```

