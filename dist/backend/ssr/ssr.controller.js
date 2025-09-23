export async function getPrerender(c) {
    const { prerender } = await c.req.getFrontendModule();
    const result = prerender();
    return c.html(result);
}
//# sourceMappingURL=ssr.controller.js.map