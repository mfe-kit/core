// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Instantiable<T = any> = { new (...args: any[]): T };

export const useSpreadAttributes = (
  props: Record<string, string[]>,
): string => {
  let result = '';
  for (const key in props) {
    result += `${key}=${props[key]} `;
  }
  return result;
};
