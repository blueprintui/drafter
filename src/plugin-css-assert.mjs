import * as csso from 'csso';

const assertions = new Map();
export function cssAssert(options = { minify: false }) {
  return {
    name: 'plugin-css-assert',
    resolveId(source, _importer, options) {
      if (options.assertions.type === 'css') {
        assertions.set(source, true);
        return null;
      }
    },
    transform(data, id) {
      if (assertions.get(id)) {
        const css = options.minify ? csso.minify(data, { comments: false }).css : data;
        const styles = '`' + css.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('$', '\\$') + '`';
        const code = `const sheet = new CSSStyleSheet();sheet.replaceSync(${styles});export default sheet;`;
        return { code, mappings: id };
      }
    }
  };
}
