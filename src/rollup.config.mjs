import nodeResolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import { rollupPluginHTML } from '@web/rollup-plugin-html';
import browsersync from 'rollup-plugin-browsersync';
import { css } from './plugin-minify-css.mjs';
import { minifyJavaScript } from './plugin-minify-javascript.mjs';

import { getConfig } from './config.js';

const userConfig = await getConfig();

export default ({ watch }) => {
  return {
    output: {
      dir: `${userConfig.dist}/iframe`,
      sourcemap: false,
      format: 'esm',
      assetFileNames: '[name][extname]'
    },
    plugins: [
      alias({ entries: userConfig.aliases }),
      css({ minify: !watch }),
      nodeResolve(),
      rollupPluginHTML({
        input: `${userConfig.dist}/*-iframe.html`,
        rootDir: `${userConfig.dist}/iframe`,
        minify: !watch,
        extractAssets: false
      }),
      !watch ? minifyJavaScript() : null,
      watch ? browsersync({
        server: {
          baseDir: userConfig.dist,
          ignore: [`${userConfig.dist}/*-iframe.html`],
          middleware: function (req, res, next) {
            Object.keys(userConfig.responseHeaders ?? { }).forEach(key => res.setHeader(key, userConfig.responseHeaders[key]));
            next();
          }
        },
        snippetOptions: {
          rule: {
            match: /<\/body>/i,
            fn: function (_snippet, match) {
              const snippet = `
              <script id="__bs_script__">
                if (document.location.pathname.endsWith('iframe.html')) {
                  const bs_script = document.createElement('script');
                  bs_script.src = '/browser-sync/browser-sync-client.js?v=2.27.10';
                  document.body.appendChild(bs_script);
                }
              </script>`
              return snippet + match;
            }
          }
        }
      }) : null
    ],
    watch: {
      clearScreen: true,
    }
  }
};
