# Studio API 文檔

本目錄包含 Studio API 的完整文檔，使用 MkDocs 構建。

## 本地開發

### 安裝依賴

```bash
pip install mkdocs mkdocs-material mkdocs-mermaid2-plugin pymdown-extensions
```

### 啟動本地伺服器

```bash
cd docs
mkdocs serve
```

文檔將在 http://127.0.0.1:8000 上可用。

### 構建文檔

```bash
cd docs
mkdocs build
```

構建後的文檔將在 `docs/site/` 目錄中。

## GitHub Pages 部署

### 啟用 GitHub Pages

1. 前往 mirror repository 的 Settings
2. 選擇 Pages
3. 在 Source 中選擇 "GitHub Actions"
4. 保存設置

### 自動部署

當以下情況發生時，文檔會自動部署：

- 推送到 `main` 分支
- `docs/` 目錄中的文件有變更
- `.github/workflows/docs.yml` 有變更
- 手動觸發 workflow

### 訪問文檔

部署完成後，文檔將在以下 URL 可用：

```
https://ikigai-kevin-k.github.io/studio-api-mirror/
```

## 文檔結構

```
docs/
├── mkdocs.yml          # MkDocs 配置文件
└── docs/               # 文檔源文件
    ├── index.md        # 首頁
    ├── getting-started.md
    ├── api/            # API 文檔
    ├── examples/        # 範例程式碼
    └── reference/      # 參考資料
```

## 編輯文檔

1. 編輯 `docs/docs/` 目錄中的 Markdown 文件
2. 使用 `mkdocs serve` 預覽變更
3. 提交並推送到 repository
4. GitHub Actions 會自動構建並部署

## 注意事項

- 文檔使用繁體中文撰寫
- 程式碼範例使用英文註解
- 所有 API 端點和參數都有詳細說明
- 包含完整的範例程式碼（JavaScript、Python、cURL）

