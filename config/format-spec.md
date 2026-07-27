# 內容排版規格（format-spec）— v1

> 適用範圍：cases[] 與 rejected[] 的**所有前台顯示文字**欄位
> （title、source、why、how、result、caveat、takeaway、blurb、metrics、reason）。
> 這份補足 blurb-spec.md（僅規範 blurb 一個欄位）沒涵蓋、但整站都要遵守的排版規則。

## 四條規則

1. **source 標籤要短（撰寫規則，收案時就寫短）。** 格式 `發布方 + 案例 + 關鍵主體`，控制在約 20 字內。
   - 「Customer Case Study／Case Studies／Customer Stories」一律寫成「案例」。
   - 受訪者／執行方等角色描述省略，只保留關鍵主體，用「・」相接。
   - 例：`Hotjar Customer Case Study（執行方：UX/CRO 代理商 Turum-burum）` → `Hotjar 案例・Turum-burum`。
2. **中英數之間留半形空格。** 例：`ROI 達 8.5 倍`、`雙 11`、`轉換率 +38%`。（自動）
3. **引號一律用「」，禁止『』。**（自動）
4. **禁止雙破折號「——」。** 要停頓或轉折，改用逗號或冒號。（自動）

## 強制方式（單一真實來源＝程式碼）

規則 2–4 是機械規則，**不靠人工**，由 `scripts/normalize-cases.js` 於每日發布 commit 前自動執行：

```
npm install pangu --no-save --silent 2>/dev/null || true
node scripts/normalize-cases.js cases.json
```

- 腳本冪等，對已正規化的檔案重跑不會再變動。
- 若 pangu 安裝失敗，腳本自動略過「半形空格」一項、其餘照做，**不得因正規化而中斷每日收錄**。
- 規則 1（source 寫短）屬撰寫判斷，腳本不代勞，收案時依上面格式寫短。

> 註：blurb-spec.md 第 5 條「防 AI 味規則」已禁 `—／——` 並允許少量全形「──」；本規格與腳本只自動處理雙破折號「——」，單破折號請撰寫時自行避免。
