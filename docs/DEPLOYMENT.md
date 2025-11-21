# 文檔部署說明

## 問題解決

### 已修復的問題

1. **sync-mirror workflow SSH key 錯誤**
   - 已添加錯誤處理，當 SSH key 未配置時會優雅地跳過
   - 已設置 `paths-ignore` 來忽略 docs 變更（文檔部署在 mirror repository 中進行）

2. **docs workflow 配置**
   - 已更新為使用 GitHub Pages 官方部署 action
   - 已添加 repository 檢查，只在 mirror repository 中運行

## 啟用 GitHub Pages

### 步驟 1: 在 Mirror Repository 中啟用 Pages

1. 前往 https://github.com/ikigai-kevin-k/studio-api-mirror/settings/pages
2. 在 **Source** 部分選擇 **"GitHub Actions"**
3. 點擊 **Save**

### 步驟 2: 合併文檔分支到 main

文檔 workflow 會在以下情況觸發：
- 推送到 `main` 分支
- 推送到 `dev/kevin/docs` 分支
- `docs/` 目錄中的文件有變更

將 `dev/kevin/docs` 分支合併到 `main` 分支：

```bash
# 在 mirror repository 中
git checkout main
git merge dev/kevin/docs
git push mirror main
```

或者透過 GitHub 創建 Pull Request 並合併。

### 步驟 3: 檢查部署狀態

1. 前往 https://github.com/ikigai-kevin-k/studio-api-mirror/actions
2. 查看 "Deploy Documentation" workflow 的執行狀態
3. 等待部署完成

### 步驟 4: 訪問文檔

部署完成後，文檔將在以下 URL 可用：

```
https://ikigai-kevin-k.github.io/studio-api-mirror/
```

## 本地測試

在部署前，您可以在本地測試文檔：

```bash
cd docs
pip install mkdocs mkdocs-material mkdocs-mermaid2-plugin pymdown-extensions
mkdocs serve
```

文檔將在 http://127.0.0.1:8000 上可用。

## 故障排除

### 問題：Workflow 沒有運行

**解決方案**:
- 確認已在 mirror repository 的 Settings > Pages 中啟用 GitHub Actions
- 確認 workflow 文件已推送到 repository
- 檢查 workflow 是否在正確的分支上

### 問題：部署失敗

**解決方案**:
- 檢查 Actions 頁面的錯誤訊息
- 確認 Python 版本正確（3.10）
- 確認所有依賴都已安裝
- 檢查 `docs/mkdocs.yml` 配置是否正確

### 問題：文檔無法訪問

**解決方案**:
- 確認 GitHub Pages 已啟用
- 等待幾分鐘讓 DNS 更新
- 檢查 repository 的 Pages 設置
- 確認 workflow 已成功完成

## 更新文檔

要更新文檔：

1. 編輯 `docs/docs/` 目錄中的 Markdown 文件
2. 提交並推送到 repository
3. GitHub Actions 會自動構建並部署

## 注意事項

- 文檔 workflow 只在 mirror repository (`ikigai-kevin-k/studio-api-mirror`) 中運行
- 在原本的 repository 中，docs workflow 會被跳過（因為 repository 檢查）
- 文檔變更會通過 sync-mirror workflow 同步到 mirror repository
- 建議在 mirror repository 中直接編輯和部署文檔

