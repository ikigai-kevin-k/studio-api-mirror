# 文檔翻譯說明 / Translation Guide

## 多語言支持已啟用 / Multi-language Support Enabled

文檔現在支持中英文切換功能。用戶可以在文檔頁面右上角看到語言切換器。

The documentation now supports Chinese-English switching. Users can see the language switcher in the top right corner of the documentation pages.

## 當前狀態 / Current Status

### 已完成英文翻譯 / Completed English Translations

- ✅ Home (index.md)
- ✅ Getting Started (getting-started.md)
- ✅ API Overview (api/overview.md)
- ✅ Authentication (api/authentication.md)
- ✅ Device Management (api/http/device.md)

### 待翻譯文檔 / Pending Translations

以下文檔需要完成英文翻譯：

The following documents need English translation:

- [ ] Status Management (api/http/status.md)
- [ ] WebSocket Connection Setup (api/websocket/connection.md)
- [ ] WebSocket Device Registration (api/websocket/device-registration.md)
- [ ] WebSocket Status Update (api/websocket/status-update.md)
- [ ] WebSocket Error Signal (api/websocket/error-signal.md)
- [ ] JavaScript Examples (examples/javascript.md)
- [ ] Python Examples (examples/python.md)
- [ ] cURL Examples (examples/curl.md)
- [ ] Error Codes Reference (reference/error-codes.md)
- [ ] Status Enums Reference (reference/status-enums.md)
- [ ] WebSocket Events Reference (reference/websocket-events.md)

## 如何添加翻譯 / How to Add Translations

### 步驟 / Steps

1. **找到對應的中文文檔**
   Find the corresponding Chinese document

2. **創建英文版本**
   Create English version in `docs/docs/en/` directory with the same structure

3. **翻譯內容**
   Translate the content while keeping:
   - Code examples unchanged
   - API endpoints unchanged
   - JSON structures unchanged
   - Only translate text descriptions

4. **提交更改**
   Commit and push the changes

### 範例 / Example

中文文檔位置：
Chinese document location: `docs/docs/api/http/status.md`

英文文檔位置：
English document location: `docs/docs/en/api/http/status.md`

## 配置說明 / Configuration

多語言配置在 `docs/mkdocs.yml` 中：

Multi-language configuration is in `docs/mkdocs.yml`:

```yaml
theme:
  language: zh-TW

extra:
  alternate:
    - name: English
      link: /en/
      lang: en
    - name: 繁體中文
      link: /
      lang: zh-TW
```

## 語言切換器 / Language Switcher

語言切換器會自動出現在文檔頁面的右上角，允許用戶在中英文之間切換。

The language switcher automatically appears in the top right corner of documentation pages, allowing users to switch between Chinese and English.

## 注意事項 / Notes

- 程式碼範例不需要翻譯（保持英文）
- Code examples don't need translation (keep in English)
- API 端點和參數名稱保持不變
- API endpoints and parameter names remain unchanged
- 只翻譯文字描述和說明
- Only translate text descriptions and explanations

