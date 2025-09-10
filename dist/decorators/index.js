const observedAttributes = [];
const watchers = new Map();
export function Component(constructor) {
    Object.defineProperty(constructor, 'observedAttributes', {
        get() {
            return observedAttributes;
        },
        configurable: true,
    });
    constructor.prototype.attributeChangedCallback = function (name, oldVal, newVal) {
        this[name] = newVal;
        const method = watchers.get(name);
        if (method && typeof this[method] === 'function') {
            this[method](oldVal, newVal);
        }
    };
}
export function Attribute() {
    return function (_, propertyKey) {
        if (typeof propertyKey === 'string' &&
            !observedAttributes.includes(propertyKey)) {
            observedAttributes.push(propertyKey);
        }
    };
}
export function Watch(attr) {
    return function (_, propertyKey) {
        if (typeof propertyKey === 'string') {
            watchers.set(attr, propertyKey);
        }
    };
}
//# sourceMappingURL=index.js.map