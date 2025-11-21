# GitHub Pages 設置指南

## 錯誤解決

如果遇到 "Get Pages site failed" 錯誤，請按照以下步驟手動啟用 GitHub Pages。

## 手動啟用步驟

### 方法 1: 透過 GitHub Web 界面（推薦）

1. **前往 Repository Settings**
   - 打開 https://github.com/ikigai-kevin-k/studio-api-mirror/settings/pages

2. **啟用 GitHub Pages**
   - 在 **Source** 部分，選擇 **"GitHub Actions"**
   - 點擊 **Save**

3. **驗證設置**
   - 確認 Source 顯示為 "GitHub Actions"
   - 等待幾秒鐘讓設置生效

4. **重新運行 Workflow**
   - 前往 https://github.com/ikigai-kevin-k/studio-api-mirror/actions
   - 找到失敗的 workflow run
   - 點擊 "Re-run jobs" 或推送新的 commit

### 方法 2: 使用 GitHub CLI

```bash
# 啟用 GitHub Pages（使用 GitHub Actions）
gh api repos/ikigai-kevin-k/studio-api-mirror/pages \
  -X POST \
  -f source='{"type":"workflow","path":"/docs"}' \
  -f build_type="workflow"
```

### 方法 3: 檢查 Repository 權限

確保 repository 設置正確：

1. **Repository Visibility**
   - 如果 repository 是私有的，需要升級到 GitHub Pro/Team/Enterprise
   - 或者將 repository 設為公開

2. **Repository Settings**
   - 前往 Settings > General
   - 確認 "Features" 中的 "Pages" 已啟用

## 驗證設置

### 檢查 Pages 狀態

```bash
# 使用 GitHub CLI 檢查 Pages 狀態
gh api repos/ikigai-kevin-k/studio-api-mirror/pages
```

### 檢查 Workflow 權限

確保 workflow 有正確的權限：

```yaml
permissions:
  contents: write
  pages: write
  id-token: write
```

這些權限已在 `docs.yml` workflow 中設置。

## 常見問題

### Q: 為什麼會出現 "Get Pages site failed" 錯誤？

**A**: 這表示 GitHub Pages 還沒有在 repository 中啟用。需要手動在 Settings > Pages 中啟用。

### Q: `enablement: true` 參數為什麼不起作用？

**A**: `enablement: true` 參數需要 repository 已經允許使用 GitHub Actions 作為 Pages 源。如果這是第一次設置，可能需要先手動啟用一次。

### Q: 私有 Repository 可以使用 GitHub Pages 嗎？

**A**: 可以，但需要 GitHub Pro、Team 或 Enterprise 訂閱。免費帳戶只能為公開 repository 使用 GitHub Pages。

### Q: 部署後多久可以訪問文檔？

**A**: 通常需要 1-2 分鐘讓部署完成，然後可能需要幾分鐘讓 DNS 更新。文檔將在以下 URL 可用：

```
https://ikigai-kevin-k.github.io/studio-api-mirror/
```

## 下一步

啟用 GitHub Pages 後：

1. 重新運行 workflow 或推送新的 commit
2. 等待部署完成
3. 訪問 https://ikigai-kevin-k.github.io/studio-api-mirror/ 查看文檔

## 自動化設置（未來）

一旦手動啟用後，後續的部署將自動進行，無需再次手動設置。

