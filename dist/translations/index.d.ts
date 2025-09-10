export type PathInto<T extends Record<string, any>, V = string> = keyof {
    [K in keyof T as T[K] extends V ? K : T[K] extends Record<string, any> ? `${K & string}.${PathInto<T[K], V> & string}` : never]: any;
};
export type GetFieldType<Obj, Path> = Path extends `${infer Left}.${infer Right}` ? Left extends keyof Obj ? GetFieldType<Exclude<Obj[Left], undefined>, Right> | Extract<Obj[Left], undefined> : undefined : Path extends keyof Obj ? Obj[Path] : undefined;
export declare class TranslationService<T extends Record<L, R>, L extends string, R extends Record<string, any>> {
    private translations;
    private currentTranslation;
    private locale;
    constructor(translations: T);
    useLocale(locale: L): void;
    t(key: PathInto<R, string>, opts?: Record<string, string>): string;
    plural(key: PathInto<T, Function>, count: number, opts?: Record<string, string>): string;
    currency(amount: number, currency?: string, options?: Intl.NumberFormatOptions): string;
    private applyOpts;
    private getTranslation;
}
//# sourceMappingURL=index.d.ts.map