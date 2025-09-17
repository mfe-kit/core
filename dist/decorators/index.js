const observedAttributes = [];
const watchers = new Map();
function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function toCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
export function Component(constructor) {
    Object.defineProperty(constructor, 'observedAttributes', {
        get() {
            return observedAttributes;
        },
        configurable: true,
    });
    constructor.prototype.attributeChangedCallback = function (name, oldVal, newVal) {
        const propertyName = toCamelCase(name);
        this[propertyName] = newVal;
        const method = watchers.get(name);
        if (method && typeof this[method] === 'function') {
            this[method](oldVal, newVal);
        }
    };
}
export function Attribute() {
    return function (_, propertyKey) {
        if (typeof propertyKey === 'string') {
            const attrName = toKebabCase(propertyKey);
            if (!observedAttributes.includes(attrName)) {
                observedAttributes.push(attrName);
            }
        }
    };
}
export function Watch(attr) {
    return function (_, propertyKey) {
        if (typeof propertyKey === 'string') {
            const attrName = toKebabCase(attr);
            watchers.set(attrName, propertyKey);
        }
    };
}
//# sourceMappingURL=index.js.map