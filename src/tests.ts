import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { showResults, COLORS, type TestCounters } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const counters: TestCounters = {
  errorsCounter: 0,
  successCounter: 0,
};

async function runTests(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await runTests(fullPath);
    } else if (file.endsWith('.spec.ts')) {
      console.log(
        `\n${COLORS.magenta}Running${COLORS.reset} ${COLORS.cyan}${fullPath}${COLORS.reset}`,
      );
      try {
        const mod = await import(pathToFileURL(fullPath).href);
        if (typeof mod.runTests === 'function') {
          mod.runTests(counters);
        } else {
          console.warn(`⚠️  ${file} does not export runTests`);
        }
      } catch (e) {
        console.error(`Test failed in ${fullPath}`);
        console.error(e);
      }
    }
  }
}

runTests(path.resolve(__dirname, './')).then(() => showResults(counters));
