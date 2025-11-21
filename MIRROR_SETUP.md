# Mirror Repository 設置說明

本文件說明如何設置和維護 `studio-api-mirror` mirror repository。

## 📋 設置步驟

### 1. 在 GitHub 上創建 Mirror Repository

在 `ikigai-kevin-k` 的個人帳戶中創建一個新的 repository：

1. 前往 https://github.com/new
2. Repository name: `studio-api-mirror`
3. 選擇 **Private** 或 **Public**（根據需求）
4. **不要** 初始化 README、.gitignore 或 license（保持空白）
5. 點擊 "Create repository"

### 2. 設置 GitHub Actions Secret（自動同步）

為了讓 GitHub Actions 能夠自動推送到 mirror repository，需要設置 SSH key：

#### 2.1 生成 SSH Key（如果還沒有）

```bash
ssh-keygen -t ed25519 -C "github-actions-mirror" -f ~/.ssh/github_mirror_key
```

#### 2.2 將 Public Key 添加到 Mirror Repository

```bash
# 複製 public key
cat ~/.ssh/github_mirror_key.pub
```

然後：
1. 前往 https://github.com/ikigai-kevin-k/studio-api-mirror/settings/keys
2. 點擊 "Add deploy key"
3. 貼上 public key
4. 勾選 "Allow write access"
5. 點擊 "Add key"

#### 2.3 將 Private Key 添加到 Source Repository Secrets

```bash
# 複製 private key
cat ~/.ssh/github_mirror_key
```

然後：
1. 前往 https://github.com/Ikigaians/studio-api/settings/secrets/actions
2. 點擊 "New repository secret"
3. Name: `MIRROR_SSH_PRIVATE_KEY`
4. Value: 貼上 private key（包含 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）
5. 點擊 "Add secret"

### 3. 驗證設置

#### 3.1 檢查 Remote 配置

```bash
git remote -v
```

應該看到：
```
mirror	git@github.com:ikigai-kevin-k/studio-api-mirror.git (fetch)
mirror	git@github.com:ikigai-kevin-k/studio-api-mirror.git (push)
origin	git@github.com:Ikigaians/studio-api.git (fetch)
origin	git@github.com:Ikigaians/studio-api.git (push)
```

#### 3.2 手動測試同步

```bash
# 執行同步腳本
./sync-mirror.sh
```

或手動執行：

```bash
# 推送所有分支
git push --all mirror

# 推送所有標籤
git push --tags mirror
```

## 🔄 自動同步機制

### GitHub Actions 自動同步

當原本的 repository (`Ikigaians/studio-api`) 有任何更新時：
- 推送到任何分支 → 自動同步到 mirror
- 推送任何標籤 → 自動同步到 mirror
- 可以手動觸發 workflow

查看同步狀態：
https://github.com/Ikigaians/studio-api/actions/workflows/sync-mirror.yml

### 手動同步

如果需要手動同步，執行：

```bash
./sync-mirror.sh
```

## 🔧 本地 Git 配置（ikigai-kevin-k 專用）

### Push 配置

**已配置為：推送時只推送到 mirror，不推送到 origin**

當 `ikigai-kevin-k` 執行 `git push` 時：
- ✅ 會推送到 `mirror` (ikigai-kevin-k/studio-api-mirror)
- ❌ **不會**推送到 `origin` (Ikigaians/studio-api)

這是通過設置 `branch.main.remote = mirror` 實現的。

### Pull 配置

**已配置為：從 origin 和 mirror 同時拉取變更**

使用以下命令從兩個 remote 同時拉取：

```bash
# 使用自定義 alias（推薦）
git pull-all

# 或直接執行腳本
./git-pull-all.sh
```

這個腳本會：
1. 從 `origin` fetch 最新變更
2. 從 `mirror` fetch 最新變更
3. 合併 `origin/main` 的變更
4. 合併 `mirror/main` 的變更

### 標準 Git 命令行為

- `git push` → 只推送到 mirror
- `git pull` → 從 mirror 拉取（因為 branch 的 remote 設為 mirror）
- `git pull-all` → 從 origin 和 mirror 同時拉取（推薦使用）
- `git fetch origin` → 從 origin 拉取但不合併
- `git fetch mirror` → 從 mirror 拉取但不合併
- `git fetch --all` → 從所有 remote 拉取

## 📝 注意事項

1. **首次同步**：需要先手動執行一次 `./sync-mirror.sh` 來推送所有現有的分支和標籤
2. **權限**：確保 SSH key 有寫入權限到 mirror repository
3. **衝突處理**：如果 mirror repository 有本地修改，同步時會使用 `--force` 覆蓋
4. **私有 Repository**：如果 mirror repository 是私有的，確保 `ikigai-kevin-k` 帳戶有權限訪問

## 🛠️ 故障排除

### 問題：GitHub Actions 同步失敗

1. 檢查 `MIRROR_SSH_PRIVATE_KEY` secret 是否正確設置
2. 確認 SSH key 已添加到 mirror repository 的 deploy keys
3. 確認 deploy key 有 "Allow write access" 權限

### 問題：手動同步失敗

1. 確認 mirror remote 已正確添加：`git remote -v`
2. 確認 SSH key 已添加到 GitHub：`ssh -T git@github.com`
3. 確認 mirror repository 存在且可訪問

### 問題：某些分支沒有同步

執行完整同步：
```bash
git fetch origin
git push --all mirror
git push --tags mirror
```

