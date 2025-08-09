import { camelCaseToKebabCase } from './utils.js';

export function createIFrames(project, modules) {
  return modules.flatMap(module => module.examples.map(example => {
    return {
      path: `${module.name}-${camelCaseToKebabCase(example.name)}-iframe.html`,
      template: getIframeTemplate(project, module, example)
    }
  }));
}

function getIframeTemplate(project, module, example) {
  return /* html */`
<!doctype html>
<html>
  <head>
    <title>${module.name} - ${camelCaseToKebabCase(example.name)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${project.baseUrl ? `<base href="${project.baseUrl}">` : ''}
    <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Ctext%20x='0'%20y='14'%3E🚀3C/text%3E%3C/svg%3E" type="image/svg+xml" />
    <style>
      #__bs_notify__ { display: none !important; }
    </style>
    ${project.head()}
  </head>
  <body bp-text="body">
    <script type="module">
      const broadcastManager = new BroadcastChannel('drafter-manager');
      broadcastManager.postMessage('frame-ready');

      function traceCalls(obj) {
        let handler = {
          get(target, propKey, receiver) {
            const origMethod = target[propKey];
            return function (...args) {
              let result = origMethod.apply(this, args);
              try {
                broadcastManager.postMessage({ action: 'log', detail: args });
              } catch {
                broadcastManager.postMessage({ action: 'log', detail: 'could not serialize' });
              }

              return result;
            };
          }
        };
        return new Proxy(obj, handler);
      }

      window.console = traceCalls(console);
    </script>
    ${example.src}
  </body>
</html>
  `;
}