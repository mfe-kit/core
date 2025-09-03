/* eslint-disable */
export type PathInto<T extends Record<string, any>, V = string> = keyof {
  [K in keyof T as T[K] extends V
    ? K
    : T[K] extends Record<string, any>
      ? `${K & string}.${PathInto<T[K], V> & string}`
      : never]: any;
};

export type GetFieldType<Obj, Path> =
  Path extends `${infer Left}.${infer Right}`
    ? Left extends keyof Obj
      ?
          | GetFieldType<Exclude<Obj[Left], undefined>, Right>
          | Extract<Obj[Left], undefined>
      : undefined
    : Path extends keyof Obj
      ? Obj[Path]
      : undefined;

export class TranslationService<
  T extends Record<L, R>,
  L extends string,
  R extends Record<string, any>,
> {
  private translations: T;
  private currentTranslation: R;
  private locale: L;
  constructor(translations: T) {
    this.translations = translations;
    this.currentTranslation = {} as R;
    this.locale = '' as L;
  }

  useLocale(locale: L): void {
    this.currentTranslation = this.translations[locale];
    this.locale = locale;
    if (!this.currentTranslation) {
      throw `Locale: ${locale} is not supporting!`;
    }
  }

  t(key: PathInto<R, string>, opts?: Record<string, string>): string {
    const result = this.getTranslation(this.currentTranslation, key, '');

    return this.applyOpts(result, opts);
  }

  plural(
    key: PathInto<T, Function>,
    count: number,
    opts?: Record<string, string>,
  ): string {
    const pluralFn = this.getTranslation(
      this.currentTranslation,
      key,
    ) as Function;
    if (!pluralFn || typeof pluralFn !== 'function') {
      return '';
    }

    const result = pluralFn(count);
    return this.applyOpts(result, opts);
  }

  currency(
    amount: number,
    currency = 'EUR',
    options: Intl.NumberFormatOptions = {},
  ) {
    const formatter = new Intl.NumberFormat(this.locale.replace('_', '-'), {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      ...options,
    });

    return formatter.format(amount);
  }

  private applyOpts(str: string, opts?: Record<string, string>): string {
    if (opts) {
      Object.entries(opts).forEach(([k, v]) => {
        str = str.replaceAll(`{{${k}}}`, v);
      });
    }

    return str;
  }

  private getTranslation<TData, TPath extends string>(
    data: TData,
    path: TPath,
  ): GetFieldType<TData, TPath> | undefined;

  private getTranslation<TData, TPath extends string, TDefault>(
    data: TData,
    path: TPath,
    defaultValue: TDefault,
  ): Exclude<GetFieldType<TData, TPath>, undefined> | TDefault;

  private getTranslation<TData, TPath extends string, TDefault>(
    data: TData,
    path: TPath,
    defaultValue?: TDefault,
  ): GetFieldType<TData, TPath> | TDefault {
    const value = path
      .split('.')
      .reduce<
        GetFieldType<TData, TPath>
      >((value, key) => (value as any)?.[key], data as any);

    return value !== undefined ? value : (defaultValue as TDefault);
  }
}
