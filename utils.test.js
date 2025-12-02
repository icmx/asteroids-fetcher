import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { env, wait } from './utils.js';

describe('env function', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('when environment variable exists', () => {
    it('should return the value of an existing environment variable', () => {
      process.env.TEST_VAR = 'test_value';

      const result = env('TEST_VAR');

      assert.equal(result, 'test_value');
    });
  });

  describe('when environment variable does not exist', () => {
    it('should throw an error for undefined environment variable', () => {
      assert.throws(
        () => env('NON_EXISTENT_VAR'),
        new Error(
          '"NON_EXISTENT_VAR" environment variable is not defined'
        )
      );
    });
  });

  describe('edge cases', () => {
    it('should throw an error for empty string values', () => {
      process.env.EMPTY_VAR = '';

      assert.throws(
        () => env('EMPTY_VAR'),
        new Error('"EMPTY_VAR" environment variable is not defined')
      );
    });

    it('should return "false" string value', () => {
      process.env.BOOL_VAR = 'false';

      const result = env('BOOL_VAR');

      assert.equal(result, 'false');
    });

    it('should return "0" string value', () => {
      process.env.ZERO_VAR = '0';

      const result = env('ZERO_VAR');

      assert.equal(result, '0');
    });
  });
});

describe('wait function', () => {
  let startTime;

  beforeEach(() => {
    startTime = Date.now();
  });

  it('should return a Promise', () => {
    const result = wait(100);

    assert(result instanceof Promise, 'wait should return a Promise');
  });

  it('should resolve after the specified delay', async () => {
    const delay = 100;
    const tolerance = 50;

    const start = Date.now();
    await wait(delay);
    const elapsed = Date.now() - start;

    assert(
      elapsed >= delay,
      `Should wait at least ${delay}ms, but only waited ${elapsed}ms`
    );

    assert(
      elapsed < delay + tolerance,
      `Should wait close to ${delay}ms, but waited ${elapsed}ms`
    );
  });

  it('should work with async/await in sequence', async () => {
    const delay1 = 50;
    const delay2 = 50;
    const tolerance = 50;

    const start = Date.now();
    await wait(delay1);
    await wait(delay2);
    const elapsed = Date.now() - start;

    const totalDelay = delay1 + delay2;

    assert(
      elapsed >= totalDelay,
      `Sequential waits should take at least ${totalDelay}ms`
    );

    assert(
      elapsed < totalDelay + tolerance,
      `Should complete close to ${totalDelay}ms`
    );
  });
});
