
export function camelCaseToKebabCase(value) {
  return value.replace(/[A-Z]/g, l => `-${l.toLowerCase()}`);
}

export function getTemplateContent(template) {
  const match = template.match(/<template>([\s\S]*?)<\/template>/im);
  return match ? match.pop() : template;
}
