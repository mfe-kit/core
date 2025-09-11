export type TestCounters = {
  errorsCounter: number;
  successCounter: number;
};

type COLORS = 'reset' | 'red' | 'green' | 'cyan' | 'magenta';

export const COLORS: Record<COLORS, string> = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFunctionMock<T extends (...args: any[]) => any>(fn: T) {
  let called = false;

  const mockFn = ((...args: Parameters<T>): ReturnType<T> => {
    called = true;
    return fn(...args);
  }) as T & {
    isCalled: () => boolean;
    reset: () => void;
  };

  mockFn.isCalled = () => called;
  mockFn.reset = () => {
    called = false;
  };

  return mockFn;
}

export function createTestExecutor(counters: TestCounters) {
  return function (name: string, cb: () => void): void {
    try {
      cb();
      counters.successCounter++;
      console.log(`${COLORS.green}✅ Test passed: ${name}${COLORS.reset}`);
    } catch (e) {
      counters.errorsCounter++;
      console.log(
        `${COLORS.red}❌ Test failed: ${name}${COLORS.reset}\n${(e as Error).message}`,
      );
    }
  };
}

export function showResults(counters: TestCounters): void {
  if (!counters.errorsCounter) {
    console.log(`\n${COLORS.green}=======================`);
    console.log(`🎉 All tests passed: ${counters.successCounter}`);
    console.log(`=======================${COLORS.reset}`);
  } else {
    console.log(`\n${COLORS.red}===========================`);
    console.log(`🔴 Failed tests counter: ${counters.errorsCounter}`);
    console.log(`===========================${COLORS.reset}`);
  }
}
