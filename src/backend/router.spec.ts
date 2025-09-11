import assert from 'assert';
import { Context, Hono } from 'hono';

import { coreRouter } from './router';
import {
  createTestExecutor,
  createFunctionMock,
  type TestCounters,
} from '../utils';

export function runTests(counters: TestCounters) {
  const executeTest = createTestExecutor(counters);
  executeTest('router instance', () => {
    assert.notStrictEqual(coreRouter, undefined);
    assert.strictEqual(typeof coreRouter, 'object');
    assert.notStrictEqual(coreRouter.fetch, undefined);
  });

  executeTest('health endpoint', async () => {
    const request = new Request('http://localhost/health', { method: 'GET' });
    const response = await coreRouter.fetch(request);
    assert.strictEqual(response.status, 200);

    const text = await response.text();
    assert.strictEqual(text, 'OK');
  });

  executeTest('prerender endpoint', async () => {
    const testText = 'pewpew';

    const getPrerender = createFunctionMock((c: Context) => c.text(testText));

    const router = new Hono();
    router.get('/prerender', getPrerender);

    const request = new Request('http://localhost/prerender', {
      method: 'GET',
    });
    const response = await router.fetch(request);
    const text = await response.text();
    assert.strictEqual(getPrerender.isCalled(), true);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(text, testText);
  });

  executeTest('non-existed routes', async () => {
    const request = new Request('http://localhost/nonexistent', {
      method: 'GET',
    });
    const response = await coreRouter.fetch(request);
    assert.strictEqual(response.status, 404);
  });

  executeTest('wrong HTTP methods', async () => {
    const request = new Request('http://localhost/health', { method: 'POST' });
    const response = await coreRouter.fetch(request);
    assert(
      response.status === 404 || response.status === 405,
      'Wrong HTTP method should return 404 or 405',
    );
  });
}
