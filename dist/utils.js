export const COLORS = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFunctionMock(fn) {
    let called = false;
    const mockFn = ((...args) => {
        called = true;
        return fn(...args);
    });
    mockFn.isCalled = () => called;
    mockFn.reset = () => {
        called = false;
    };
    return mockFn;
}
export function createTestExecutor(counters) {
    return function (name, cb) {
        try {
            cb();
            counters.successCounter++;
            console.log(`${COLORS.green}✅ Test passed: ${name}${COLORS.reset}`);
        }
        catch (e) {
            counters.errorsCounter++;
            console.log(`${COLORS.red}❌ Test failed: ${name}${COLORS.reset}\n${e.message}`);
        }
    };
}
export function showResults(counters) {
    if (!counters.errorsCounter) {
        console.log(`\n${COLORS.green}=======================`);
        console.log(`🎉 All tests passed: ${counters.successCounter}`);
        console.log(`=======================${COLORS.reset}`);
    }
    else {
        console.log(`\n${COLORS.red}===========================`);
        console.log(`🔴 Failed tests counter: ${counters.errorsCounter}`);
        console.log(`===========================${COLORS.reset}`);
    }
}
//# sourceMappingURL=utils.js.map