#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';

function safeRun(cmd) {
  try {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    console.error('❌ Failed:', cmd);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const type = args[0];
if (!['patch', 'minor', 'major'].includes(type)) {
  console.error('Usage: npm run release <patch|minor|major>');
  process.exit(1);
}

// --- Step 1: git pull to sync ---
safeRun('git pull origin main');

// --- Step 2: read package.json ---
const pkgPath = './package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const [maj, min, pat] = pkg.version.split('.').map(Number);

// --- Step 3: bump version ---
switch (type) {
  case 'major':
    pkg.version = `${maj + 1}.0.0`;
    break;
  case 'minor':
    pkg.version = `${maj}.${min + 1}.0`;
    break;
  case 'patch':
    pkg.version = `${maj}.${min}.${pat + 1}`;
    break;
}
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
const newVersion = `v${pkg.version}`;

// --- Step 4: commit package.json ---
safeRun('git add package.json package-lock.json');
safeRun(`git commit -m "Release ${newVersion}"`);

// --- Step 6: create tag ---
safeRun(`git tag ${newVersion}`);

// --- Step 7: push branch + tag ---
safeRun(`git push origin main`);
safeRun(`git push origin ${newVersion}`);

console.log(`✅ Release ${newVersion} complete!`);
