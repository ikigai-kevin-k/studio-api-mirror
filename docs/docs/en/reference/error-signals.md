# Error Signal List

This page lists all Error Signal types supported by Studio API and their descriptions.

## Signal Type Categories

Error Signals are divided into two main categories:

- **Error**: Critical device errors that require immediate attention
- **Warning**: Non-critical issues or anomalies that need attention but don't require immediate action

## Error Signal List

### Connection Errors

#### CONN_001 - Connection Lost
- **Type**: `error`
- **Title**: Connection Error
- **Description**: The device lost connection to the server
- **Suggestion**: Check network connection and retry
- **Severity**: High

```json
{
  "msgId": "error-conn-001",
  "content": "Device connection lost",
  "metadata": {
    "signalType": "error",
    "title": "Connection Error",
    "description": "The device lost connection to the server",
    "code": "CONN_001",
    "suggestion": "Check network connection and retry"
  }
}
```

#### CONN_002 - Connection Timeout
- **Type**: `error`
- **Title**: Connection Timeout
- **Description**: The device connection timed out
- **Suggestion**: Check network stability and retry connection
- **Severity**: High

#### CONN_003 - Connection Instability
- **Type**: `warning`
- **Title**: Connection Instability
- **Description**: The device connection is unstable with frequent disconnections
- **Suggestion**: Check network quality and signal strength
- **Severity**: Medium

### Device Status Errors

#### DEV_001 - Device Offline
- **Type**: `error`
- **Title**: Device Offline
- **Description**: The device is offline or not responding
- **Suggestion**: Check device power and network connection
- **Severity**: High

#### DEV_002 - Device Initialization Failed
- **Type**: `error`
- **Title**: Device Initialization Failed
- **Description**: The device failed to initialize properly
- **Suggestion**: Restart the device and check system logs
- **Severity**: High

#### DEV_003 - Device Slow Response
- **Type**: `warning`
- **Title**: Device Slow Response
- **Description**: The device is responding slower than expected
- **Suggestion**: Check device performance and resource usage
- **Severity**: Medium

### Temperature Errors

#### TEMP_001 - High Temperature
- **Type**: `warning`
- **Title**: High Temperature Warning
- **Description**: Device temperature is above normal range
- **Suggestion**: Check cooling system and ensure proper ventilation
- **Severity**: Medium

```json
{
  "msgId": "warning-temp-001",
  "content": "High temperature detected",
  "metadata": {
    "signalType": "warning",
    "title": "Temperature Warning",
    "description": "Device temperature is above normal range",
    "code": "TEMP_001",
    "suggestion": "Check cooling system"
  }
}
```

#### TEMP_002 - Low Temperature
- **Type**: `warning`
- **Title**: Low Temperature Warning
- **Description**: Device temperature is below normal range
- **Suggestion**: Check heating system and ambient temperature
- **Severity**: Low

#### TEMP_003 - Temperature Anomaly
- **Type**: `error`
- **Title**: Temperature Anomaly
- **Description**: Device temperature is critically outside normal range
- **Suggestion**: Immediately check device and cooling/heating systems
- **Severity**: High

### Performance Errors

#### PERF_001 - Performance Degradation
- **Type**: `warning`
- **Title**: Performance Degradation
- **Description**: Device performance is below expected level
- **Suggestion**: Check system resources and optimize performance
- **Severity**: Medium

```json
{
  "msgId": "warning-perf-001",
  "content": "Performance degradation",
  "metadata": {
    "signalType": "warning",
    "title": "Performance Warning",
    "description": "Device performance is below expected level",
    "code": "PERF_001",
    "suggestion": "Check system resources"
  }
}
```

#### PERF_002 - High CPU Usage
- **Type**: `warning`
- **Title**: High CPU Usage
- **Description**: Device CPU usage is above threshold
- **Suggestion**: Check running processes and optimize resource usage
- **Severity**: Medium

#### PERF_003 - Memory Insufficient
- **Type**: `error`
- **Title**: Memory Insufficient
- **Description**: Device memory usage is critically high
- **Suggestion**: Free up memory or increase device memory capacity
- **Severity**: High

### Hardware Errors

#### HW_001 - Hardware Failure
- **Type**: `error`
- **Title**: Hardware Failure
- **Description**: A critical hardware component has failed
- **Suggestion**: Contact support for hardware inspection and replacement
- **Severity**: High

#### HW_002 - Sensor Malfunction
- **Type**: `error`
- **Title**: Sensor Malfunction
- **Description**: A sensor is not functioning correctly
- **Suggestion**: Check sensor connections and calibration
- **Severity**: High

#### HW_003 - Power Anomaly
- **Type**: `error`
- **Title**: Power Anomaly
- **Description**: Device power supply is unstable or abnormal
- **Suggestion**: Check power supply and connections
- **Severity**: High

### Software Errors

#### SW_001 - Application Error
- **Type**: `error`
- **Title**: Application Error
- **Description**: The application encountered an unexpected error
- **Suggestion**: Check application logs and restart if necessary
- **Severity**: Medium

#### SW_002 - Service Exception
- **Type**: `error`
- **Title**: Service Exception
- **Description**: A critical service has stopped or is not responding
- **Suggestion**: Restart the service and check service logs
- **Severity**: High

#### SW_003 - Configuration Error
- **Type**: `warning`
- **Title**: Configuration Error
- **Description**: Device configuration is incorrect or missing
- **Suggestion**: Review and update device configuration
- **Severity**: Medium

### Data Errors

#### DATA_001 - Data Sync Failure
- **Type**: `error`
- **Title**: Data Sync Failure
- **Description**: Failed to synchronize data with the server
- **Suggestion**: Check network connection and retry synchronization
- **Severity**: Medium

#### DATA_002 - Data Corruption
- **Type**: `error`
- **Title**: Data Corruption
- **Description**: Detected corrupted data in device storage
- **Suggestion**: Backup and restore data from backup
- **Severity**: High

#### DATA_003 - Storage Insufficient
- **Type**: `warning`
- **Title**: Storage Insufficient
- **Description**: Device storage space is running low
- **Suggestion**: Free up storage space or expand storage capacity
- **Severity**: Medium

### Security Errors

#### SEC_001 - Authentication Failed
- **Type**: `error`
- **Title**: Authentication Failed
- **Description**: Device authentication failed
- **Suggestion**: Check credentials and authentication configuration
- **Severity**: High

#### SEC_002 - Unauthorized Access
- **Type**: `error`
- **Title**: Unauthorized Access
- **Description**: Unauthorized access attempt detected
- **Suggestion**: Review security logs and update access controls
- **Severity**: High

### Critical Errors

#### CRIT_001 - Critical System Failure
- **Type**: `error`
- **Title**: Critical System Failure
- **Description**: Device has encountered a critical failure
- **Suggestion**: Immediately contact support for emergency assistance
- **Severity**: Critical

```json
{
  "msgId": "error-crit-001",
  "content": "Critical device failure",
  "metadata": {
    "signalType": "error",
    "title": "Critical Error",
    "description": "Device has encountered a critical failure",
    "code": "CRIT_001",
    "suggestion": "Contact support immediately"
  }
}
```

#### CRIT_002 - System Crash
- **Type**: `error`
- **Title**: System Crash
- **Description**: The device system has crashed
- **Suggestion**: Restart device and check system logs
- **Severity**: Critical

## Error Code Naming Convention

Error Signal codes follow this naming convention:

- **Prefix**: Indicates error category
  - `CONN_` - Connection related
  - `DEV_` - Device related
  - `TEMP_` - Temperature related
  - `PERF_` - Performance related
  - `HW_` - Hardware related
  - `SW_` - Software related
  - `DATA_` - Data related
  - `SEC_` - Security related
  - `CRIT_` - Critical errors

- **Number**: Three digits, starting from 001

## Usage Recommendations

1. **Choose Appropriate signalType**
   - Use `error` for critical issues requiring immediate attention
   - Use `warning` for issues that need attention but aren't urgent

2. **Provide Clear Descriptions**
   - `title`: Brief error title
   - `description`: Detailed error description
   - `suggestion`: Specific handling recommendations

3. **Use Unique msgId**
   - Use a unique `msgId` for each error signal
   - Recommended format: `{type}-{category}-{number}`, e.g., `error-conn-001`

4. **Include Timestamp**
   - Include the error occurrence time in `metadata.timestamp`
   - Use millisecond-level timestamp

## Related Documentation

- [WebSocket API - Error Signal](../api/websocket/error-signal.md) - How to send error signals
- [Error Codes Reference](error-codes.md) - API error code list
- [WebSocket Events](websocket-events.md) - WebSocket events reference

