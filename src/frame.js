import fs from 'fs-extra';
import { resolve } from 'path';
import { camelCaseToKebabCase } from './utils.js';

export function createIFrames(project, modules) {
  modules.forEach(module => module.examples.forEach(example => createIframe(project, example, module)));
}

function createIframe(project, example, module) {
  const path = resolve(project.dist, '_site', 'components', module.metadata.name, `${camelCaseToKebabCase(example.name)}-iframe.html`);
  const template = getIframeTemplate(project, example, module);
  fs.createFileSync(path);
  fs.writeFileSync(path, template);
}

function getIframeTemplate(project, example, module) {
  const template =  (example.fn instanceof Function ? example.fn() : 'not a function').replaceAll('<template>', '').replaceAll('</template>', '');
  return /* html */`
<!doctype html>
<html>
  <head>
    <title>${module.metadata.name} - ${camelCaseToKebabCase(example.name)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Ctext%20x='0'%20y='14'%3E🚀3C/text%3E%3C/svg%3E" type="image/svg+xml" />
    ${project.head()}
  </head>
  <body bp-text="body">
    ${template}
    <script type="module">
      const broadcastManager = new BroadcastChannel('webpad-manager');
      broadcastManager.postMessage('frame-ready');

      function traceCalls(obj) {
        let handler = {
          get(target, propKey, receiver) {
            const origMethod = target[propKey];
            return function (...args) {
              let result = origMethod.apply(this, args);
              try {
                broadcastManager.postMessage({ action: 'log', detail: args });
              } catch { }

              return result;
            };
          }
        };
        return new Proxy(obj, handler);
      }

      window.console = traceCalls(console);
    </script>
  </body>
</html>
  `;
}