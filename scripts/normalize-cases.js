#!/usr/bin/env node
/*
 * 排版正規化（機械規則，發布前自動強制執行）
 * 對 cases.json 內 cases[] 與 rejected[] 的顯示文字欄位套用：
 *   規則2 中英數之間補半形空格（用 pangu；若環境沒有 pangu 則略過此項）
 *   規則3 『』→「」
 *   規則4 雙破折號「——」→ 逗號（並清理因此產生的重複逗號）
 * 不動：url、分類鍵（cats/f_industry/f_product/f_goal/industry）、scores、facets、score 結構。
 * 冪等：對已正規化的檔案重跑不會再變動。
 *
 * 規則1（source 標籤要短）屬撰寫判斷，見 config/format-spec.md，由收案時寫短，本腳本不代勞。
 *
 * 用法：node scripts/normalize-cases.js [cases.json]
 */
const fs = require('fs');
const path = process.argv[2] || 'cases.json';

let spacer = null;
try { spacer = require('pangu').pangu; } catch (e) { /* 無 pangu → 只做符號正規化，不中斷 */ }

function fixSymbols(s) {
  if (typeof s !== 'string') return s;
  s = s.replace(/『/g, '「').replace(/』/g, '」');          // 規則3
  s = s.replace(/——/g, '，')                                // 規則4
       .replace(/，{2,}/g, '，')
       .replace(/([，、；：。！？「」])，/g, '$1')
       .replace(/，([。！？；）」])/g, '$1');
  return s;
}
function fixText(s) {
  if (typeof s !== 'string' || !s) return s;
  s = fixSymbols(s);
  return spacer ? spacer.spacingText(s) : s;               // 規則2
}

const d = JSON.parse(fs.readFileSync(path, 'utf8'));
const PROSE = ['title', 'source', 'author', 'why', 'how', 'result', 'caveat', 'takeaway', 'blurb'];
let changed = 0;
const mark = (a, b) => { if (a !== b) changed++; return b; };

for (const c of (d.cases || [])) {
  for (const f of PROSE) if (typeof c[f] === 'string') c[f] = mark(c[f], fixText(c[f]));
  if (Array.isArray(c.metrics))
    c.metrics = c.metrics.map(m => Array.isArray(m) ? m.map(x => mark(x, fixText(x))) : m);
  if (Array.isArray(c.score_notes))
    c.score_notes = c.score_notes.map(x => mark(x, fixSymbols(x))); // 評分理由只做符號，保留「=N」結構
}
for (const r of (d.rejected || [])) {
  for (const f of ['title', 'source', 'reason']) if (typeof r[f] === 'string') r[f] = mark(r[f], fixText(r[f]));
}

fs.writeFileSync(path, JSON.stringify(d, null, 2) + '\n', 'utf8');
console.log(`[normalize-cases] pangu=${spacer ? 'on' : 'off'} fields_changed=${changed}`);
