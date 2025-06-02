# Solana Copy Trade Address Filter

這是一個用於分析 Solana 代幣交易的工具，可以幫助你追蹤和分析特定代幣的交易行為。

## 功能特點

- 分析特定代幣的交易歷史
- 追蹤交易者的獲利情況
- 篩選交易者（基於投資金額、獲利、持有時間等）
- 本地快取機制，提高查詢效率
- 分頁顯示結果

## 安裝步驟

1. 克隆專案：
```bash
git clone https://github.com/anguslinangus/SolCopyTradeAddressFilter.git
cd SolCopyTradeAddressFilter
```

2. 安裝依賴：
```bash
npm install
```

3. 設置 API 金鑰：
   - 在專案根目錄創建 `.env` 文件
   - 添加以下內容：
   ```
   VITE_SOLANA_TRACKER_API_KEY=你的_API_金鑰
   ```
   - 你可以在 [Solana Tracker](https://solanatracker.io/) 申請免費的 API 金鑰

4. 啟動開發服務器：
```bash
npm run dev
```

## 使用說明

1. 在輸入框中輸入要分析的代幣地址
2. 點擊分析按鈕開始分析
3. 使用篩選器來過濾結果：
   - SOL 投資金額範圍
   - 最小獲利金額
   - 最小獲利百分比
   - 持有時間範圍

## 注意事項

- API 金鑰請妥善保管，不要分享給他人
- 建議將 `.env` 文件添加到 `.gitignore` 中，避免意外提交
- 免費版 API 可能有請求限制，請注意使用頻率

## 技術棧

- Vue 3
- Vite
- Solana Tracker API

## 授權

MIT License
