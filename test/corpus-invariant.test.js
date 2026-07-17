'use strict';
// Invariant: every published case must satisfy the gate; every rejected case must not.
// Guards against the corpus drifting out of policy over daily updates.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { evaluate } = require('../scripts/score-gate.js');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'cases.json'), 'utf8')
);

test('every published case passes the gate', () => {
  for (const c of data.cases) {
    const hasCaveat = !!(c.caveat && c.caveat.trim().length > 0);
    const r = evaluate({ scores: c.scores, tier: c.tier || 0, hasCaveat });
    assert.strictEqual(
      r.pass, true,
      `published but fails gate: "${c.title}" scores=${c.scores} -> ${r.reasons.join('; ')}`
    );
  }
});

test('every rejected case fails the gate', () => {
  for (const c of data.rejected || []) {
    // give benefit of the doubt on caveat; must still fail on floors/total
    const r = evaluate({ scores: c.scores, tier: c.tier || 0, hasCaveat: true });
    assert.strictEqual(
      r.pass, false,
      `rejected but would pass gate: "${c.title}" scores=${c.scores}`
    );
  }
});
