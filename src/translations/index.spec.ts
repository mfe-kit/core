import * as assert from 'assert';
import { TranslationService, type PathInto } from './index';

type Resource = typeof en_GB;
type Locale = 'en_GB' | 'uk_UA';

const COLORS: Record<string, string> = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
};

const en_GB = {
  general: {
    title: 'Cat inspector',
    btnText: 'Another one',
    success: 'Success',
    error: 'There was an error loading your data',
  },
  plurals: {
    items: (count: number) => {
      if (count === 0) return 'No items';
      if (count === 1) return '1 item';
      return `${count} items`;
    },
    messages: (count: number) =>
      `You have {{count}} message${count === 1 ? '' : 's'}`,
  },
};

const uk_UA: Resource = {
  general: {
    title: 'Котячий інспектор',
    btnText: 'Інший',
    success: 'Вітаннячко!',
    error: 'Лишенько, у нас помилка',
  },
  plurals: {
    items: (count: number) => {
      if (count === 0) return 'Немає елементів';
      if (count === 1) return '1 елемент';
      if (count < 5) return `${count} елементи`;
      return `${count} елементів`;
    },
    messages: () => `У вас {{count}} повідомлень`,
  },
};

export const resources: Record<Locale, Resource> = {
  en_GB,
  uk_UA,
};

const service = new TranslationService<
  Record<Locale, Resource>,
  Locale,
  Resource
>(resources);

let errorsCounter: number;
let successCounter: number;

function runTests() {
  errorsCounter = 0;
  successCounter = 0;
  // Test useLocale function
  executeTest('useLocale function', () => {
    service.useLocale('en_GB');
    assert.strictEqual(service.t('general.title'), 'Cat inspector');
    service.useLocale('uk_UA');
    assert.strictEqual(service.t('general.title'), 'Котячий інспектор');
  });

  // Test missing key function with default
  executeTest('missing key function', () => {
    assert.strictEqual(
      service.t('nonexistent' as PathInto<Resource>, { default: 'Default' }),
      '',
    );
  });

  // Test currency formatting function
  executeTest('currency formatting function', () => {
    service.useLocale('en_GB');
    assert.strictEqual(service.currency(1234.56, 'USD'), '$1,234.56');
    service.useLocale('uk_UA');
    assert.strictEqual(service.currency(1234.56, 'UAH'), '1 234,56 ₴');
  });

  // Test plural function - basic cases
  executeTest('plural function - basic cases', () => {
    service.useLocale('en_GB');
    assert.strictEqual(
      service.plural(
        'plurals.items' as PathInto<Record<Locale, Resource>, Function>,
        0,
      ),
      'No items',
    );
    assert.strictEqual(
      service.plural(
        'plurals.items' as PathInto<Record<Locale, Resource>, Function>,
        1,
      ),
      '1 item',
    );
    assert.strictEqual(
      service.plural(
        'plurals.items' as PathInto<Record<Locale, Resource>, Function>,
        5,
      ),
      '5 items',
    );
  });

  // Test plural function with options
  executeTest('plural function with options', () => {
    service.useLocale('en_GB');
    const result = service.plural(
      'plurals.messages' as PathInto<Record<Locale, Resource>, Function>,
      3,
      { count: '3' },
    );
    assert.strictEqual(result, 'You have 3 messages');
  });

  // Test plural function - Ukrainian locale
  executeTest('plural function - Ukrainian', () => {
    service.useLocale('uk_UA');
    assert.strictEqual(
      service.plural(
        'plurals.items' as PathInto<Record<Locale, Resource>, Function>,
        1,
      ),
      '1 елемент',
    );
    assert.strictEqual(
      service.plural(
        'plurals.items' as PathInto<Record<Locale, Resource>, Function>,
        3,
      ),
      '3 елементи',
    );
    assert.strictEqual(
      service.plural(
        'plurals.items' as PathInto<Record<Locale, Resource>, Function>,
        10,
      ),
      '10 елементів',
    );
  });

  // Test plural function with missing key
  executeTest('plural function with missing key', () => {
    service.useLocale('en_GB');
    const result = service.plural(
      'nonexistent' as PathInto<Record<Locale, Resource>, Function>,
      5,
    );
    assert.strictEqual(result, '');
  });

  // Test plural function with non-function value
  executeTest('plural function with non-function value', () => {
    service.useLocale('en_GB');
    const result = service.plural(
      'general.title' as PathInto<Record<Locale, Resource>, Function>,
      5,
    );
    assert.strictEqual(result, '');
  });

  if (!errorsCounter) {
    console.log(`\n${COLORS.green}=======================`);
    console.log(`🎉 All tests passed: ${successCounter}`);
    console.log(`=======================${COLORS.reset}`);
  } else {
    console.log(`\n${COLORS.red}===========================`);
    console.log(`🔴 Failed tests counter: ${errorsCounter}`);
    console.log(`===========================${COLORS.reset}`);
  }
}

function executeTest(name: string, cb: () => void): void {
  try {
    cb();
    successCounter++;
    console.log(`${COLORS.green}✅ Test passed: ${name}${COLORS.reset}`);
  } catch (e) {
    errorsCounter++;
    console.log(
      `${COLORS.red}❌ Test failed: ${name}${COLORS.reset}\n${(e as Error).message}`,
    );
  }
}

runTests();
