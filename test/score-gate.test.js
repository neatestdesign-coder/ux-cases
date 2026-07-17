'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { evaluate, TIER_BONUS } = require('../scripts/score-gate.js');

// helper: scores order = [business, decision, quantified, firsthand, transferability]
const S = (b, d, q, f, t) => [b, d, q, f, t];

test('tier bonus table matches spec', () => {
  assert.strictEqual(TIER_BONUS[1], 1.0);
  assert.strictEqual(TIER_BONUS[2], 0.5);
  assert.strictEqual(TIER_BONUS[3], 0.5);
  assert.strictEqual(TIER_BONUS[4], 0);
  assert.strictEqual(TIER_BONUS[0], 0);
});

test('total = sum(scores) + tier bonus', () => {
  const r = evaluate({ scores: S(2, 2, 2, 2, 2), tier: 1, hasCaveat: true });
  assert.strictEqual(r.total, 11.0); // 10 + 1.0
});

test('PASS: four 1s + one 2, tier0 firsthand=2 → exactly 6.0', () => {
  const r = evaluate({ scores: S(1, 1, 1, 2, 1), tier: 0 });
  assert.strictEqual(r.total, 6.0);
  assert.strictEqual(r.pass, true, JSON.stringify(r.reasons));
});

test('FAIL floor: quantified=0 blocks even with high others', () => {
  const r = evaluate({ scores: S(2, 2, 0, 2, 2), tier: 1, hasCaveat: true });
  assert.strictEqual(r.pass, false);
  assert.ok(r.reasons.some(x => x.includes('quantified_outcome')));
});

test('FAIL floor: firsthand=0 (anonymous) blocked by 窄放 floor', () => {
  const r = evaluate({ scores: S(2, 2, 2, 0, 2), tier: 2, hasCaveat: true });
  assert.strictEqual(r.pass, false);
  assert.ok(r.reasons.some(x => x.includes('firsthand')));
});

test('FAIL mush: all 1s tier0 → total 5.0 < 6.0', () => {
  const r = evaluate({ scores: S(1, 1, 1, 1, 1), tier: 0, hasCaveat: true });
  assert.strictEqual(r.total, 5.0);
  assert.strictEqual(r.pass, false);
  assert.ok(r.reasons.some(x => x.includes('min_total')));
});

test('FAIL mush: all 1s tier2 → total 5.5 < 6.0', () => {
  const r = evaluate({ scores: S(1, 1, 1, 1, 1), tier: 2, hasCaveat: true });
  assert.strictEqual(r.total, 5.5);
  assert.strictEqual(r.pass, false);
});

test('secondhand (firsthand=1) REQUIRES caveat', () => {
  const noCav = evaluate({ scores: S(2, 2, 2, 1, 1), tier: 2, hasCaveat: false });
  assert.strictEqual(noCav.pass, false);
  assert.ok(noCav.reasons.some(x => x.includes('caveat')));
  const withCav = evaluate({ scores: S(2, 2, 2, 1, 1), tier: 2, hasCaveat: true });
  assert.strictEqual(withCav.pass, true, JSON.stringify(withCav.reasons));
});

test('firsthand=2 does NOT require caveat', () => {
  const r = evaluate({ scores: S(2, 2, 1, 2, 1), tier: 0, hasCaveat: false });
  assert.strictEqual(r.pass, true, JSON.stringify(r.reasons));
});

test('gate constants are sourced from config/scoring.json', () => {
  const cfg = require('../config/scoring.json');
  assert.strictEqual(cfg.gate.min_total, 6.0);
  assert.strictEqual(cfg.gate.dimension_floors.firsthand, 1);
});

test('invalid input: wrong score length throws', () => {
  assert.throws(() => evaluate({ scores: [1, 2, 3], tier: 1 }));
});

test('invalid input: score out of 0..2 range throws', () => {
  assert.throws(() => evaluate({ scores: S(3, 1, 1, 1, 1), tier: 1 }));
});
