import type { Context, Next, MiddlewareHandler } from 'hono';
import { createServer as createViteServer } from 'vite';
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM();
global.document = jsdom.window.document;
global.HTMLElement = jsdom.window.HTMLElement;
global.customElements = jsdom.window.customElements;
global.CustomEvent = jsdom.window.CustomEvent;

export const vite = await createViteServer({
  server: { middlewareMode: true },
  mode: 'development',
  configFile: false,
  plugins: [],
});

const devSSRMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next,
): Promise<void> => {
  try {
    c.req.getFrontendModule = () => vite.ssrLoadModule('src/frontend/index.ts');
  } catch (e) {
    vite.ssrFixStacktrace(e as Error);
  }
  await next();
};

const prodSSRMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  c.req.getFrontendModule = () => import('./frontend.es.mjs');
  await next();
};

export const ssrMiddleware: MiddlewareHandler =
  process.env.VITE_ENV === 'development' ? devSSRMiddleware : prodSSRMiddleware;
