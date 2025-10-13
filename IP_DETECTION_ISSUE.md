# IP 偵測問題記錄

## 問題描述
- 使用容器化環境 (Podman + host 網路模式)
- API middleware 無法正確偵測真實的客戶端 IP
- 從 192.168.0.238 的電腦訪問，但 log 顯示的是 127.0.0.1 或其他 IP

## 原始問題
- 最初在 prod.yml 中有 `EXPECTED_CLIENT_IP=192.168.0.126` 環境變數
- 導致所有請求都顯示為 192.168.0.126，無論實際來源

## 已嘗試的解決方案

### ✅ 已完成：移除硬編碼 IP
1. 移除 `podman-compose.prod.yml` 中的 `EXPECTED_CLIENT_IP` 環境變數
2. 移除 `middleware.py` 中硬編碼返回 192.168.0.126 的邏輯

### ❌ 選項 A：修改容器網路配置 (Bridge 網路)
- 嘗試改用 bridge 網路而非 host 網路
- 結果：看到的 IP 變成 Podman gateway IP (10.89.1.1)
- 問題：仍然無法識別真實客戶端 IP

### ❌ 選項 1：增強 logging 記錄更多資訊
- 嘗試記錄 Host, User-Agent, Referer 等資訊來識別客戶端
- 問題：無法分辨是哪一台電腦連上的，不符合需求

### ❌ 選項 2：使用 Host 系統反向代理
- 嘗試在 Windows host 系統上運行 nginx 反向代理
- 問題：Windows nginx 配置複雜，啟動時遇到目錄和權限問題

## 當前狀態
- 已退回到選項 2 之前的狀態
- 使用 host 網路模式
- middleware 包含 WSL2 IP 偵測邏輯
- 問題：仍然無法正確偵測真實客戶端 IP

## 可能的下一步方案
1. 簡化版的 host 反向代理 (使用更簡單的工具如 Caddy)
2. 修改應用邏輯，不依賴客戶端 IP 進行識別
3. 使用其他容器網路方案 (如 macvlan)
4. 在 middleware 中實作更智能的 IP 推斷邏輯

## 技術細節
- 容器使用 `network_mode: "host"`
- 前端 nginx 在容器內運行，端口 5174
- 後端 FastAPI 在容器內運行，端口 8001
- 客戶端通過 `http://192.168.0.145:5174/api/reports` 訪問

## 相關檔案
- `podman-compose.prod.yml` - 容器配置
- `backend/app/middleware.py` - IP 偵測邏輯
- `frontend/nginx.conf` - 容器內 nginx 配置