import { Hono } from 'hono';
import { getPrerender } from './ssr/ssr.controller';
const router = new Hono();
router.get('/health', (c) => c.text('OK'));
router.get('/prerender', getPrerender);
export const coreRouter = router;
//# sourceMappingURL=router.js.map