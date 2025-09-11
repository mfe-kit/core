export type TestCounters = {
    errorsCounter: number;
    successCounter: number;
};
type COLORS = 'reset' | 'red' | 'green' | 'cyan' | 'magenta';
export declare const COLORS: Record<COLORS, string>;
export declare function createFunctionMock<T extends (...args: any[]) => any>(fn: T): T & {
    isCalled: () => boolean;
    reset: () => void;
};
export declare function createTestExecutor(counters: TestCounters): (name: string, cb: () => void) => void;
export declare function showResults(counters: TestCounters): void;
export {};
//# sourceMappingURL=utils.d.ts.map