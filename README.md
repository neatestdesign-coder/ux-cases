# UX 商業案例分享

每日自動收集全球「看得到商業脈絡、決策過程與量化成果」的真實 UX × 商業案例，
以五維品質規則評分後發佈。寧缺勿濫，所有摘要皆附原文連結、不轉載全文。

**線上瀏覽**：啟用 GitHub Pages 後見 `https://neatestdesign-coder.github.io/ux-cases/`

## 結構
- `index.html` — 前台網站（讀取 `cases.json`；本機開啟時用內建 fallback 資料）
- `cases.json` — 案例資料源（自動化每日更新）
- `config/` — 白名單來源、五維評分規則、設計系統定義

## 評分規則
五維各 0–2 分（商業脈絡・決策過程・量化成果・第一手性・可遷移性）＋來源層級加成。
發佈需同時滿足：**五維每一維 ≥ 1**、**總分（含加成）≥ 6.0**、**二手案附可回溯出處的 caveat**（窄放規則）。
未達門檻者公開列於淘汰區，供檢驗評分鬆緊。規則定義見 `config/scoring.json`，閘門邏輯與測試見 `scripts/score-gate.js`、`test/`。

Powered by [@meme.design.ai](https://www.threads.com/@meme.design.ai)
