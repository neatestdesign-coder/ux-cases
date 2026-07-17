'use strict';
/**
 * Scoring gate for UX 商業案例分享.
 * Single source of truth for thresholds is config/scoring.json.
 *
 * 發佈條件（全部 AND）：
 *   1) 五維每一維 ≥ 其下限（gate.dimension_floors，皆為 1）
 *   2) 五維總和 + 來源 tier 加成 ≥ gate.min_total (6.0)
 *   3) 若為二手（firsthand < 2），必須附回溯 caveat（窄放規則）
 *
 * scores order = [business_context, decision_process, quantified_outcome,
 *                 firsthand, transferability]
 */
const cfg = require('../config/scoring.json');

const DIM_KEYS = cfg.dimensions.map((d) => d.key);
const FLOORS = cfg.gate.dimension_floors;
const MIN_TOTAL = cfg.gate.min_total;

const TIER_BONUS = { 0: 0, 1: 1.0, 2: 0.5, 3: 0.5, 4: 0 };

function evaluate({ scores, tier = 0, hasCaveat = false }) {
  if (!Array.isArray(scores) || scores.length !== DIM_KEYS.length) {
    throw new Error(`scores must be an array of ${DIM_KEYS.length} values`);
  }
  for (const v of scores) {
    if (!Number.isInteger(v) || v < 0 || v > 2) {
      throw new Error(`each score must be an integer 0..2, got ${v}`);
    }
  }

  const bonus = TIER_BONUS[tier] ?? 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  const total = Math.round((sum + bonus) * 100) / 100;

  const reasons = [];

  // 1) dimension floors
  DIM_KEYS.forEach((key, i) => {
    const floor = FLOORS[key] ?? 0;
    if (scores[i] < floor) {
      reasons.push(`floor: ${key}=${scores[i]} < ${floor}`);
    }
  });

  // 2) min total
  if (total < MIN_TOTAL) {
    reasons.push(`min_total: ${total} < ${MIN_TOTAL}`);
  }

  // 3) 窄放 caveat (only meaningful when firsthand passes its floor of >=1)
  const firsthand = scores[DIM_KEYS.indexOf('firsthand')];
  if (firsthand < 2 && !hasCaveat) {
    reasons.push('caveat: 二手案（firsthand<2）必須附回溯 caveat');
  }

  return { pass: reasons.length === 0, total, bonus, reasons };
}

module.exports = { evaluate, TIER_BONUS, MIN_TOTAL, FLOORS, DIM_KEYS };
