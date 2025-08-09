
export function camelCaseToKebabCase(value) {
  return value.replace(/[A-Z]/g, l => `-${l.toLowerCase()}`);
}
