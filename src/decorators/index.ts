const observedAttributes: Array<string> = [];
const watchers = new Map<string, string>();

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function Component(constructor: Function): void {
  Object.defineProperty(constructor, 'observedAttributes', {
    get() {
      return observedAttributes;
    },
    configurable: true,
  });

  constructor.prototype.attributeChangedCallback = function (
    name: string,
    oldVal: string,
    newVal: string,
  ) {
    const propertyName = toCamelCase(name);
    this[propertyName] = newVal;
    const method = watchers.get(name);
    if (method && typeof this[method] === 'function') {
      this[method](oldVal, newVal);
    }
  };
}

export function Attribute(): PropertyDecorator {
  return function (_: unknown, propertyKey: string | symbol) {
    if (typeof propertyKey === 'string') {
      const attrName = toKebabCase(propertyKey);
      if (!observedAttributes.includes(attrName)) {
        observedAttributes.push(attrName);
      }
    }
  };
}

export function Watch(attr: string): MethodDecorator {
  return function (_: unknown, functionName: string | symbol) {
    if (typeof functionName === 'string') {
      const attrName = toKebabCase(attr);
      watchers.set(attrName, functionName);
    }
  };
}
