import assert from 'assert';
import { useSpreadAttributes } from './index';
import { createTestExecutor, type TestCounters } from '../utils';

export function runTests(counters: TestCounters) {
  const executeTest = createTestExecutor(counters);
  // Test useSpreadAttributes function
  executeTest('useSpreadAttributes function', () => {
    const testObj = {
      name: ['name'],
      version: ['1'],
      lang: ['eng'],
    };
    const result = useSpreadAttributes(testObj);

    assert.strictEqual(result, 'name=name version=1 lang=eng ');
  });
}
