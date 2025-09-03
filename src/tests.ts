import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await runTests(fullPath);
    } else if (file.endsWith('.spec.ts')) {
      console.log(`\nRunning ${fullPath}`);
      try {
        await import(pathToFileURL(fullPath).href);
      } catch (e) {
        console.error(`Test failed in ${fullPath}`);
        console.error(e);
      }
    }
  }
}

runTests(path.resolve(__dirname, './'));
