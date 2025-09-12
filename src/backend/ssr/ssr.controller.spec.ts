import assert from 'assert';
import { getPrerender } from './ssr.controller';
import {
  createTestExecutor,
  createFunctionMock,
  type TestCounters,
} from '../../utils';

export function runTests(counters: TestCounters) {
  const executeTest = createTestExecutor(counters);

  executeTest(
    'getPrerender should call getFrontendModule and return HTML',
    async () => {
      const mockHtml = '<html><body>Hello World</body></html>';
      const frontendModuleMock = createFunctionMock(() => ({
        prerender: () => mockHtml,
      }));
      const htmlMock = createFunctionMock((content: string) => {
        htmlContent = content;
        return new Response(content, {
          headers: { 'Content-Type': 'text/html' },
        });
      });
      let htmlContent = '';

      const mockContext = {
        req: {
          getFrontendModule: frontendModuleMock,
        },
        html: htmlMock,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await getPrerender(mockContext as any);

      assert.strictEqual(frontendModuleMock.isCalled(), true);
      assert.strictEqual(htmlMock.isCalled(), true);
      assert.strictEqual(htmlContent, mockHtml);
      assert(response instanceof Response, 'should return a Response object');
    },
  );
}
