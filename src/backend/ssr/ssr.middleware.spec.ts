import assert from 'assert';
import type { Context } from 'hono';

import {
  createTestExecutor,
  createFunctionMock,
  type TestCounters,
} from '../../utils';

export function runTests(counters: TestCounters) {
  const executeTest = createTestExecutor(counters);
  const originalEnv = process.env.VITE_ENV;

  executeTest(
    'Should export development middleware when VITE_ENV is "development"',
    async () => {
      process.env.VITE_ENV = 'development';
      const { ssrMiddleware, vite } = await import('./ssr.middleware');
      assert.strictEqual(typeof ssrMiddleware, 'function');
      await vite.close();
    },
  );

  executeTest(
    'Should export development middleware when VITE_ENV is "production"',
    async () => {
      process.env.VITE_ENV = 'production';
      const { ssrMiddleware, vite } = await import('./ssr.middleware');
      assert.strictEqual(typeof ssrMiddleware, 'function');
      await vite.close();
    },
  );

  executeTest(
    'Development middleware should set getFrontendModule and call next',
    async () => {
      process.env.VITE_ENV = 'development';
      const { ssrMiddleware, vite } = await import('./ssr.middleware');

      let getFrontendModuleSet = false;
      const mockContext = {
        req: {},
      } as Context;
      const mockNext = createFunctionMock(() => {});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ssrMiddleware(mockContext, mockNext as any);
      getFrontendModuleSet =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (mockContext.req as any).getFrontendModule === 'function';

      assert.strictEqual(getFrontendModuleSet, true);
      assert.strictEqual(mockNext.isCalled(), true);
      await vite.close();
    },
  );

  executeTest(
    'Production middleware should set getFrontendModule and call next',
    async () => {
      process.env.VITE_ENV = 'production';
      const { ssrMiddleware, vite } = await import('./ssr.middleware');

      let getFrontendModuleSet = false;
      const mockContext = {
        req: {},
      } as Context;
      const mockNext = createFunctionMock(() => {});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ssrMiddleware(mockContext, mockNext as any);
      getFrontendModuleSet =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (mockContext.req as any).getFrontendModule === 'function';

      assert.strictEqual(getFrontendModuleSet, true);
      assert.strictEqual(mockNext.isCalled(), true);
      await vite.close();
    },
  );

  process.env.VITE_ENV = originalEnv;
}
