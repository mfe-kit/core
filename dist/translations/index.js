export class TranslationService {
    constructor(translations) {
        Object.defineProperty(this, "translations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentTranslation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "locale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.translations = translations;
        this.currentTranslation = {};
        this.locale = '';
    }
    useLocale(locale) {
        this.currentTranslation = this.translations[locale];
        this.locale = locale;
        if (!this.currentTranslation) {
            throw `Locale: ${locale} is not supporting!`;
        }
    }
    t(key, opts) {
        const result = this.getTranslation(this.currentTranslation, key, '');
        return this.applyOpts(result, opts);
    }
    plural(key, count, opts) {
        const pluralFn = this.getTranslation(this.currentTranslation, key);
        if (!pluralFn || typeof pluralFn !== 'function') {
            return '';
        }
        const result = pluralFn(count);
        return this.applyOpts(result, opts);
    }
    currency(amount, currency = 'EUR', options = {}) {
        const formatter = new Intl.NumberFormat(this.locale.replace('_', '-'), {
            style: 'currency',
            currency,
            currencyDisplay: 'narrowSymbol',
            ...options,
        });
        return formatter.format(amount);
    }
    applyOpts(str, opts) {
        if (opts) {
            Object.entries(opts).forEach(([k, v]) => {
                str = str.replaceAll(`{{${k}}}`, v);
            });
        }
        return str;
    }
    getTranslation(data, path, defaultValue) {
        const value = path
            .split('.')
            .reduce((value, key) => value?.[key], data);
        return value !== undefined ? value : defaultValue;
    }
}
//# sourceMappingURL=index.js.map