import fs from 'fs-extra';
import { resolve } from 'path';
import Prism from 'prismjs';
import prettier from 'prettier';
import { camelCaseToKebabCase } from './utils.js';
import { styles } from './manager.styles.js';

export function createManager(project, modules) {
  const navTemplate = createNav(modules);

  const indexPath = resolve(project.dist, '_site/index.html');
  const indexTemplate = getManagerTemplate(navTemplate, 'root');
  fs.createFileSync(indexPath);
  fs.writeFileSync(indexPath, indexTemplate);

  modules.forEach(module => {
    module.examples.forEach(example => {
      example.name = camelCaseToKebabCase(example.name);
      const examplePath = resolve(project.dist, '_site/components', module.metadata.name, `${example.name}.html`);
      const exampleTemplate =  getManagerTemplate(navTemplate, 'frame', module, example);
      fs.createFileSync(examplePath);
      fs.writeFileSync(examplePath, exampleTemplate);
  
      const codePath = resolve(project.dist, '_site/components', module.metadata.name, `${example.name}-code.html`);
      const codeTemplate = getManagerTemplate(navTemplate, 'code', module, example);
      fs.createFileSync(codePath);
      fs.writeFileSync(codePath, codeTemplate);
    });
  });
}

export function getManagerTemplate(navTemplate, type, module, example) {
  return /* html */`
<!doctype html>
<html lang="en">
  <head>
    ${headTemplate()}
    <meta name="description" content="${example?.name ?? 'Webpad Examples'}">
  </head>
  <body>
    ${navTemplate}
    <header>
      ${type !== 'root' ? /* html */`
      <nav>
        <a href="/components/${module.metadata.name}/${example.name}.html">Demo</a>
        <a href="/components/${module.metadata.name}/${example.name}-code.html">Code</a>
        <a href="/components/${module.metadata.name}/${example.name}-iframe.html" target="_blank" class="full-screen">Full Screen</a>
      </nav>`: ''}
    </header>
    <main>
      ${type === 'frame' ? /* html */`<iframe src="${example.name}-iframe.html" title="${example.name} demo" loading="lazy" frameBorder="0"></iframe><div class="action-log">...</div>` : ''}
      ${type === 'code' ? /* html */`<pre><code class="language-html">${highlightCode(example)}</code></pre>${apiTemplate(module)}` : ''}
    </main>
    <script type="module">
      import 'prismjs/themes/prism-tomorrow.min.css';
      const actionLog = document.querySelector('.action-log');
      const broadcastManager = new BroadcastChannel('webpad-manager');
      broadcastManager.addEventListener('message', message => {
        if (message.data.action === 'log') {
          const div = document.createElement('div');
          div.textContent = message.data.detail.join(' ');
          actionLog.appendChild(div);
          actionLog.scrollTop = actionLog.scrollHeight;
        }
      });
      broadcastManager.postMessage('manager-ready');

      const nav = document.querySelector('.side-nav');
      nav.scrollTop = parseInt(localStorage.getItem('nav-scroll')) ?? 0;
      window.addEventListener('beforeunload', () => localStorage.setItem('nav-scroll', nav.scrollTop));
    </script>
  </body>
</html>`;
}

function headTemplate() {
  return /* html */`
    <title>Webpad</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Ctext%20x='0'%20y='14'%3E🚀3C/text%3E%3C/svg%3E" type="image/svg+xml" />
    <style>
      ${styles}
    </style>`;
}

function createNav(modules) {
  return /* html */`<nav class="side-nav">
    ${modules.map(module => {
      const sort = (arr, name) => arr.reduce((acc, m) => m.name.includes(name) ? [m, ...acc] : [...acc, m], []);
      const examples = sort(module.examples, 'example');
      return /* html */`<ul><li>${module.metadata.name}</li>${examples.map(example => (/* html */`<li><a href="/components/${module.metadata.name}/${camelCaseToKebabCase(example.name)}.html">${camelCaseToKebabCase(example.name)}</a></li>`)).join('')}</ul>`;
    }).join('')}</nav>`;
}

function highlightCode(example) {
  const codeTemplate =  (example.fn instanceof Function ? example.fn() : 'not a function').replace('<template>', '').replace('</template>', '');
  const codeContent = prettier.format(codeTemplate, { parser: 'html', singleAttributePerLine: false, printWidth: 180, singleQuote: true }).trim();
  return Prism.highlight(codeContent, Prism.languages.html, 'html');
}

function apiTemplate(module) {
  return /* html */`${module.metadata?.elements?.map(e => /* html */`
    <h2>${e.tagName}</h2>
    <p>${e.description}</p>
    ${table('Properties', e.members)}
    ${table('Attributes', e.attributes)}
    ${table('Events', e.events)}
    ${table('CSS Properties', e.cssProperties)}
    ${table('Slots', e.slots)}
    <br /><br />
  `).join('\n') ?? ''}`
}

function table(name, rows) {
  return /* html */`
    <h3>${name}</h3>
    <table>
      <thead>
        <tr><td>Name</td><td>Types</td><td>Description</td></tr>
      </thead>
      <tbody>
      ${rows?.map(m => /* html */`<tr><td>${m.name}</td><td><code>${m.type?.text ?? ''}</code></td><td>${m.description ?? ''}</td></tr>`).join('')}
      </tbody>
    </table>`;
}