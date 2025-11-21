# SDP 狀態管理範例

本文件展示如何使用新的 SDP 擴展狀態值來管理 SDP 服務狀態。

## SDP 擴展狀態值

Studio API 現在支援以下 SDP 擴展狀態值：

### Up 狀態系列
- `up` - 服務正常運行（基本狀態）
- `up_running` - 服務運行中
- `up_idle` - 服務空閒中
- `up_resume` - 服務恢復運行

### Down 狀態系列
- `down` - 服務停止（基本狀態）
- `down_pause` - 服務暫停
- `down_cancel` - 服務取消

## HTTP API 範例

### 使用 cURL

```bash
# 更新 SDP 狀態為運行中
curl -X PATCH "http://localhost:8084/v1/service/status" \
  -H "Content-Type: application/json" \
  -H "x-signature: your-signature" \
  -d '{
    "tableId": "ARO-001-2",
    "sdp": "up_running"
  }'

# 更新 SDP 狀態為暫停
curl -X PATCH "http://localhost:8084/v1/service/status" \
  -H "Content-Type: application/json" \
  -H "x-signature: your-signature" \
  -d '{
    "tableId": "ARO-001-2",
    "sdp": "down_pause"
  }'

# 更新 SDP 狀態為恢復運行
curl -X PATCH "http://localhost:8084/v1/service/status" \
  -H "Content-Type: application/json" \
  -H "x-signature: your-signature" \
  -d '{
    "tableId": "ARO-001-2",
    "sdp": "up_resume"
  }'

# 更新 SDP 狀態為取消
curl -X PATCH "http://localhost:8084/v1/service/status" \
  -H "Content-Type: application/json" \
  -H "x-signature: your-signature" \
  -d '{
    "tableId": "ARO-001-2",
    "sdp": "down_cancel"
  }'

# 查詢當前狀態
curl -X GET "http://localhost:8084/v1/service/status?tableId=ARO-001-2" \
  -H "x-signature: your-signature"
```

### JavaScript/TypeScript

```typescript
// 更新 SDP 狀態
async function updateSdpStatus(
  tableId: string,
  sdpStatus: 'up_running' | 'up_idle' | 'up_resume' | 'down_pause' | 'down_cancel'
) {
  const response = await fetch('http://localhost:8084/v1/service/status', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-signature': 'your-signature'
    },
    body: JSON.stringify({
      tableId,
      sdp: sdpStatus
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// 使用範例
async function example() {
  // 服務開始運行
  await updateSdpStatus('ARO-001-2', 'up_running');
  
  // 服務進入空閒狀態
  await updateSdpStatus('ARO-001-2', 'up_idle');
  
  // 服務暫停
  await updateSdpStatus('ARO-001-2', 'down_pause');
  
  // 服務恢復運行
  await updateSdpStatus('ARO-001-2', 'up_resume');
  
  // 服務取消
  await updateSdpStatus('ARO-001-2', 'down_cancel');
}
```

### Python

```python
import aiohttp
import asyncio

async def update_sdp_status(
    table_id: str,
    sdp_status: str
):
    async with aiohttp.ClientSession() as session:
        async with session.patch(
            'http://localhost:8084/v1/service/status',
            headers={
                'Content-Type': 'application/json',
                'x-signature': 'your-signature'
            },
            json={
                'tableId': table_id,
                'sdp': sdp_status
            }
        ) as response:
            if response.status != 200:
                raise Exception(f'HTTP error! status: {response.status}')
            return await response.json()

# 使用範例
async def example():
    # 服務開始運行
    await update_sdp_status('ARO-001-2', 'up_running')
    
    # 服務進入空閒狀態
    await update_sdp_status('ARO-001-2', 'up_idle')
    
    # 服務暫停
    await update_sdp_status('ARO-001-2', 'down_pause')
    
    # 服務恢復運行
    await update_sdp_status('ARO-001-2', 'up_resume')
    
    # 服務取消
    await update_sdp_status('ARO-001-2', 'down_cancel')

if __name__ == '__main__':
    asyncio.run(example())
```

## WebSocket API 範例

### JavaScript/TypeScript

```typescript
// 透過 WebSocket 更新 SDP 狀態
function updateSdpStatusViaWebSocket(
  ws: WebSocket,
  tableId: string,
  sdpStatus: 'up_running' | 'up_idle' | 'up_resume' | 'down_pause' | 'down_cancel'
) {
  if (ws.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket 未連接');
  }

  ws.send(JSON.stringify({
    event: 'tableStatus',
    data: {
      tableId,
      sdp: sdpStatus,
      timestamp: Date.now()
    }
  }));
}

// 完整範例：處理 SDP 服務生命週期
class SdpStatusManager {
  private ws: WebSocket;
  private tableId: string;

  constructor(ws: WebSocket, tableId: string) {
    this.ws = ws;
    this.tableId = tableId;
  }

  // 服務啟動並開始運行
  startRunning() {
    this.updateStatus('up_running');
  }

  // 服務進入空閒狀態
  setIdle() {
    this.updateStatus('up_idle');
  }

  // 服務暫停
  pause() {
    this.updateStatus('down_pause');
  }

  // 服務恢復運行
  resume() {
    this.updateStatus('up_resume');
  }

  // 服務取消
  cancel() {
    this.updateStatus('down_cancel');
  }

  private updateStatus(status: string) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket 未連接');
      return;
    }

    this.ws.send(JSON.stringify({
      event: 'tableStatus',
      data: {
        tableId: this.tableId,
        sdp: status,
        timestamp: Date.now()
      }
    }));
  }
}

// 使用範例
const ws = new WebSocket('ws://localhost:8084/v1/ws?id=ARO-001-2&token=your-token');
const manager = new SdpStatusManager(ws, 'ARO-001-2');

ws.onopen = () => {
  // 服務啟動
  manager.startRunning();
  
  // 5 秒後進入空閒狀態
  setTimeout(() => {
    manager.setIdle();
  }, 5000);
  
  // 10 秒後暫停
  setTimeout(() => {
    manager.pause();
  }, 10000);
  
  // 15 秒後恢復
  setTimeout(() => {
    manager.resume();
  }, 15000);
};
```

### Python

```python
import asyncio
import websockets
import json
from typing import Optional

class SdpStatusManager:
    def __init__(self, websocket, table_id: str):
        self.ws = websocket
        self.table_id = table_id

    async def start_running(self):
        """服務啟動並開始運行"""
        await self.update_status('up_running')

    async def set_idle(self):
        """服務進入空閒狀態"""
        await self.update_status('up_idle')

    async def pause(self):
        """服務暫停"""
        await self.update_status('down_pause')

    async def resume(self):
        """服務恢復運行"""
        await self.update_status('up_resume')

    async def cancel(self):
        """服務取消"""
        await self.update_status('down_cancel')

    async def update_status(self, status: str):
        """更新 SDP 狀態"""
        if not self.ws:
            raise Exception('WebSocket 未連接')
        
        message = {
            'event': 'tableStatus',
            'data': {
                'tableId': self.table_id,
                'sdp': status,
                'timestamp': int(asyncio.get_event_loop().time() * 1000)
            }
        }
        await self.ws.send(json.dumps(message))

# 使用範例
async def example():
    uri = 'ws://localhost:8084/v1/ws?id=ARO-001-2&token=your-token'
    
    async with websockets.connect(uri) as websocket:
        manager = SdpStatusManager(websocket, 'ARO-001-2')
        
        # 服務啟動
        await manager.start_running()
        await asyncio.sleep(5)
        
        # 進入空閒狀態
        await manager.set_idle()
        await asyncio.sleep(5)
        
        # 暫停服務
        await manager.pause()
        await asyncio.sleep(5)
        
        # 恢復服務
        await manager.resume()
        await asyncio.sleep(5)
        
        # 取消服務
        await manager.cancel()

if __name__ == '__main__':
    asyncio.run(example())
```

## 狀態轉換場景範例

### 場景 1: 遊戲開始流程

```typescript
// 1. 服務啟動並開始運行
updateSdpStatus('ARO-001-2', 'up_running');

// 2. 遊戲進行中，服務保持運行狀態
// (狀態保持為 up_running)

// 3. 遊戲結束，服務進入空閒狀態
updateSdpStatus('ARO-001-2', 'up_idle');
```

### 場景 2: 暫停和恢復流程

```typescript
// 1. 服務正常運行
updateSdpStatus('ARO-001-2', 'up_running');

// 2. 需要暫停服務（例如：維護、錯誤處理）
updateSdpStatus('ARO-001-2', 'down_pause');

// 3. 問題解決後恢復服務
updateSdpStatus('ARO-001-2', 'up_resume');
```

### 場景 3: 取消操作流程

```typescript
// 1. 服務正在運行
updateSdpStatus('ARO-001-2', 'up_running');

// 2. 需要取消當前操作
updateSdpStatus('ARO-001-2', 'down_cancel');

// 3. 重新啟動服務
updateSdpStatus('ARO-001-2', 'up_running');
```

## 狀態查詢

### HTTP API

```bash
# 查詢當前 SDP 狀態
curl -X GET "http://localhost:8084/v1/service/status?tableId=ARO-001-2" \
  -H "x-signature: your-signature"
```

### JavaScript

```typescript
async function getSdpStatus(tableId: string) {
  const response = await fetch(
    `http://localhost:8084/v1/service/status?tableId=${tableId}`,
    {
      headers: {
        'x-signature': 'your-signature'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.sdp; // 返回 SDP 狀態值
}

// 使用範例
const status = await getSdpStatus('ARO-001-2');
console.log('當前 SDP 狀態:', status);
```

### Python

```python
async def get_sdp_status(table_id: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f'http://localhost:8084/v1/service/status?tableId={table_id}',
            headers={'x-signature': 'your-signature'}
        ) as response:
            if response.status != 200:
                raise Exception(f'HTTP error! status: {response.status}')
            data = await response.json()
            return data['data']['sdp']  # 返回 SDP 狀態值

# 使用範例
status = await get_sdp_status('ARO-001-2')
print(f'當前 SDP 狀態: {status}')
```

## 最佳實踐

1. **狀態一致性**: 確保發送的狀態值與實際服務狀態一致
2. **及時更新**: 當服務狀態變更時立即發送更新
3. **狀態轉換**: 遵循合理的狀態轉換流程
   - `up_running` → `up_idle` → `down_pause` → `up_resume`
   - `up_running` → `down_pause` → `up_resume`
   - `up_running` → `down_cancel` → `up_running`
4. **錯誤處理**: 處理狀態更新失敗的情況
5. **監控**: 定期查詢狀態以確認服務正常運行

## 相關文檔

- [HTTP API - 狀態管理](../api/http/status.md)
- [WebSocket API - 狀態更新](../api/websocket/status-update.md)
- [狀態枚舉參考](../reference/status-enums.md)

