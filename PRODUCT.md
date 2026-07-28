# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要使用者為 **UX／設計實務者**（設計師、產品經理、設計研究員）。他們在工作或自我精進的情境下，想快速吸收「看得到商業脈絡、決策過程與量化成果」的真實案例，作為參考與靈感來源。次要觸點為 @meme.design.ai 的社群受眾，可能從 Threads 導流進站深度閱讀。

## Product Purpose

每日自動收集全球真實的 UX × 商業案例，以五維品質規則評分後發佈，替實務者過濾出「寧缺勿濫」的高訊噪比案例庫。成功同時包含兩面：作為 **實用參考工具**（實務者會回訪查找、好搜好讀），以及作為 **個人品牌資產**（延伸 @meme.design.ai 的專業形象與影響力）。

## Positioning

差異化來自透明且嚴格的評分機制，是鄰近的「設計靈感牆／案例聚合站」無法輕易複製的：
- 五維各 0–2 分：商業脈絡・決策過程・量化成果・第一手性・可遷移性，另加來源層級加成。
- 發佈閘門需同時滿足：五維每一維 ≥ 1、總分（含加成）≥ 6.0、二手案附可回溯出處的 caveat。
- 未達門檻者公開列於「淘汰區」，供外界檢驗評分鬆緊——把編輯判斷攤在陽光下，而非只秀通過者。
- 一律附原文連結、不轉載全文（尊重原始出處）。

## Operating Context

- 純前台靜態站（`index.html` 讀取 `cases.json`；本機開啟時用內建 fallback 資料）。
- 以 GitHub Pages 部署：`https://neatestdesign-coder.github.io/ux-cases/`。
- 內容由自動化流程每日更新（收集 → 五維評分 → 過閘門 → 發佈／淘汰）。
- 使用者多在桌機或行動瀏覽器上瀏覽、點入單一案例深度閱讀，並可能跳轉原文。

## Capabilities and Constraints

- 案例列表以卡片呈現，含分類、來源層級 tint、五維評分（環形進度）、總分與門檻標示。
- 具「核心觀點 popup」（滿版底部抽屜／滑入動效／站內完整版／雷達）、繼續閱讀鈕、原文出處連結。
- 具淘汰區，公開未過門檻案例。
- 資料源與規則為設定驅動：`config/sources.json`（白名單來源）、`config/scoring.json`（評分規則）、`config/categories.json`、`config/design-system.json`（視覺決策記錄，非程式讀取）。
- 排版正規化規則（中英數半形空格、「」、逗號取代破折號）由 `scripts/normalize-cases.js` 與 `config/format-spec.md` 強制。
- 技術約束：靜態、無後端；樣式實際以 `index.html` 內嵌 `<style>` 為準。

## Brand Commitments

- 名稱：**UX 商業案例分享**。
- 出處署名：Powered by @meme.design.ai（Threads）。
- 既有視覺系統「**Frosted Minimalism — Case Journal**」為 **binding 約束，須維持現有視覺風格**：冷灰藍→薰衣草漸層環境光、半透明玻璃面板、超大圓角、navy 墨色作唯一深色錨點、萊姆綠僅用於關鍵框架與數字高亮、環形評分、以留白與階層（非框線）處理密度。後續 UI 精進為 **refinement（保留識別）而非 redesign（替換）**。
- 中文（繁中）為主的介面與排版規範須維持。

## Evidence on Hand

- `cases.json` — 真實案例資料（自動化每日更新，約 357KB）。
- `config/scoring.json`、`scripts/score-gate.js`、`test/` — 評分規則與閘門邏輯及其測試。
- `config/sources.json` — 白名單來源清單。
- `config/design-system.json` — 既有視覺系統的設計決策記錄。
- 所有案例摘要附原文連結；不轉載全文。未有的資料（如虛構數據、testimonials）不得捏造。

## Product Principles

- **寧缺勿濫**：訊噪比優先於數量，門檻不達不發。
- **評分透明**：淘汰區與可回溯 caveat 讓判斷可被檢驗，而非黑箱。
- **尊重原始出處**：只摘要、只導流，永不轉載全文。
- **實務可遷移**：內容價值在於讀者能把框架帶走用在自己的工作上。
- **設計服務閱讀深度與導流並重**：版面既要利於深讀，也要順暢引導至原文與品牌。
