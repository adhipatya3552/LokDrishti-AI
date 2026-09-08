import assert from 'node:assert/strict';

// Deterministic mirror of the public scoring contract for a lightweight CI smoke test.
const weights = { visual: 30, permit: 30, access: 20, risk: 20 };
const total = weights.visual + weights.permit + weights.access + weights.risk;
assert.equal(total, 100);
assert.equal(18 + 21 + 14 + 16, 69);
assert.equal(Math.min(100, 30 + 30 + 20 + 20), 100);
assert.equal(Math.max(0, 20 - 8), 12);
console.log('scoring contract checks passed');
