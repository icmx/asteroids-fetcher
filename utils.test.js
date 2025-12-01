import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Tests', () => {
  it('should run', () => {
    const value = true;

    assert.ok(value === true);
  });
});
