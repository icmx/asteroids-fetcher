import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { env } from './utils.js';

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
