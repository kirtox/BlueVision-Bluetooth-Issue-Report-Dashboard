# Duration 單位轉換修改總結

## 修改概述
將 report table 的 duration 字段從小時單位改為秒單位，並在所有使用 duration 的地方進行相應的轉換處理。

## 修改的文件

### 前端文件 (Frontend)

#### 1. 圖表組件修改
- **ReportDurationChart.tsx**
  - 將秒轉換為小時進行顯示
  - 添加小時單位標籤和 tooltip
  - 格式化顯示為小數點後2位

- **ReportMultipleDurationCrossBarChart.tsx**
  - 將秒轉換為小時進行計算和顯示
  - 更新 tooltip 和標籤格式
  - 添加小時單位標示

- **ReportGaugeChart.tsx**
  - 添加秒到小時的轉換邏輯
  - 更新顯示格式

- **ReportMultipleGaugeChart.tsx**
  - 添加秒到小時的轉換邏輯
  - 更新顯示格式，保留小數點

#### 2. 表單組件修改
- **ReportEditForm.tsx**
  - 更新 Duration 字段標籤為 "Duration (seconds)"
  - 提示用戶輸入的是秒為單位

### 後端文件 (Backend)

#### 1. 測試數據修改
- **generate_test_data.py**
  - 更新 duration_options 為秒為單位
  - 原來的 1-72 小時改為對應的秒數 (3600-259200)

- **upload_report.py**
  - 更新示例 duration 值為秒 (108000 = 30小時)

- **api_test.py**
  - 更新測試數據中的 duration 值為秒

#### 2. 導出功能修改
- **export.py**
  - 更新 CSV/Excel 導出的列標題為 "Duration (seconds)"

#### 3. 文檔更新
- **UPLOAD_SCRIPT_README.md**
  - 更新 duration 字段說明，明確標示為秒為單位

## 轉換邏輯

### 前端顯示轉換
```javascript
// 秒轉小時
const durationInHours = durationInSeconds / 3600;

// 格式化顯示
const formattedDuration = durationInHours.toFixed(2) + 'h';
```

### 數據存儲
- 數據庫中的 duration 字段現在存儲的是秒
- 所有新的測試數據都以秒為單位生成
- 舊數據如果是小時單位，需要手動轉換或重新生成

## 影響範圍

### 圖表顯示
- 所有 duration 相關的圖表現在顯示小時單位
- 保持了用戶友好的顯示格式
- 添加了適當的單位標籤和 tooltip

### 數據輸入
- 表單中明確標示需要輸入秒
- 測試數據生成器使用秒為單位

### 數據導出
- CSV/Excel 導出明確標示 duration 為秒
- 保持原始數據的完整性

## 注意事項

1. **數據一致性**: 確保所有新數據都以秒為單位輸入
2. **舊數據處理**: 如果有舊的小時數據，需要進行數據遷移
3. **用戶培訓**: 需要通知用戶現在 duration 字段使用秒為單位
4. **測試驗證**: 建議進行完整的功能測試確保轉換正確

## 測試建議

1. 創建測試數據驗證圖表顯示正確
2. 測試表單輸入和編輯功能
3. 驗證導出功能的標題和數據
4. 檢查所有 gauge chart 的閾值設置是否合理