import showdown from 'showdown';
import { camelCaseToKebabCase } from './utils.js';
import { styles } from './manager.styles.js';

const converter = new showdown.Converter();

export function createManager(project, modules) {  
  const examples = modules.flatMap(module => {
    return module.examples.flatMap(example => {
      example.name = camelCaseToKebabCase(example.name);
      const navTemplate = createNav(modules, `${module.name}-${example.name}.html`);

      return [
        {
          path: `${module.name}-${example.name}.html`,
          template: getManagerTemplate(project, navTemplate, 'frame', module, example)
        },
        {
          path: `${module.name}-${example.name}-code.html`,
          template: getManagerTemplate(project, navTemplate, 'code', module, example)
        }
      ];
    });
  });

  return [
    {
      path: 'index.html',
      template: getManagerTemplate(project, createNav(modules), 'root')
    },
    ...examples
  ];
}

function getManagerTemplate(project, navTemplate, type, module, example) {
  return /* html */`
<!doctype html>
<html lang="en">
  <head>
    <title>Drafter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Ctext%20x='0'%20y='14'%3E🚀3C/text%3E%3C/svg%3E" type="image/svg+xml" />
    <style>${styles}</style>
    <meta name="description" content="${example?.name ?? 'Drafter Examples'}">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="${project.baseUrl}">
    <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Ctext%20x='0'%20y='14'%3E🚀3C/text%3E%3C/svg%3E" type="image/svg+xml" />
  </head>
  <body>
    ${navTemplate}
    <div class="content-panel">
      <header>
        ${type !== 'root' ? /* html */`
        <nav>
          <a href="${module.name}-${example.name}.html">Demo 📐</a>
          <a href="${module.name}-${example.name}-code.html">Code 📘</a>
          <a href="iframe/${module.name}-${example.name}-iframe.html" target="_blank" class="full-screen">Full Screen ↗️</a>
        </nav>`: ''}
      </header>
      <main>
        ${type === 'frame' ? /* html */`<iframe src="iframe/${module.name}-${example.name}-iframe.html" title="${example.name} demo" loading="lazy" frameBorder="0"></iframe><div class="action-log"></div>` : ''}
        ${type === 'code' ? /* html */`<pre><code class="language-html">${example.formattedSrc}</code></pre>${apiTemplate(module)}` : ''}
      </main>
    </div>
    <script type="module">
      const main = document.querySelector('main');
      const actionLog = document.querySelector('.action-log');
      const broadcastManager = new BroadcastChannel('drafter-manager');
      broadcastManager.addEventListener('message', message => {
        if (message.data.action === 'log') {
          const div = document.createElement('div');
          div.textContent = message.data.detail.map(i => JSON.stringify(i, null, 2)).join(' ▶ ');
          actionLog.appendChild(div);
          actionLog.scrollTop = actionLog.scrollHeight;
          main.classList.add('action-log-active');
        }
      });
      broadcastManager.postMessage('manager-ready');

      const nav = document.querySelector('.side-nav');
      nav.scrollTop = parseInt(localStorage.getItem('nav-scroll')) ?? 0;
      window.addEventListener('beforeunload', () => {
        localStorage.setItem('nav-scroll', nav.scrollTop);
      });
    </script>
  </body>
</html>`;
}

function createNav(modules, path = '') {
  return /* html */`<nav class="side-nav">
    ${modules.map(module => {
      const sort = (arr, name) => arr.reduce((acc, m) => m.name.includes(name) ? [m, ...acc] : [...acc, m], []);
      const examples = sort(module.examples, 'example');
      return /* html */`<ul><li>${module.name}</li>${examples.map(example => {
        const href = `${module.name}-${camelCaseToKebabCase(example.name)}.html`;
        return /* html */`<li ${path === href ? ' selected' : ''}><a href="${href}">${camelCaseToKebabCase(example.name)}</a></li>`
      }).join('')}</ul>`;
    }).join('')}</nav>`;
}

function apiTemplate(module) {
  return /* html */`${module?.elements?.map(e => {
    return /* html */`
      <h2>${e.tagName}</h2>
      <p>${converter.makeHtml(e.description)}</p>
      ${table('Properties', e.members?.filter(m => m.privacy !== 'private').filter(m => m.privacy !== 'protected').filter(m => !m.name.startsWith('#')).filter(m => !m.name.startsWith('_')))}
      ${table('Attributes', e.attributes?.filter(m => !m.name.startsWith('_')))}
      ${table('Events', e.events)}
      ${table('CSS Properties', e.cssProperties)}
      ${table('Slots', e.slots?.map(s => s.name ? s : ({ ...s, name: 'default' })))}
      <br /><br />
    `
  }).join('\n') ?? ''}`
}

function table(name, rows) {
  return rows ? /* html */`
    <h3>${name}</h3>
    <table>
      <thead>
        <tr><td>Name</td><td>Types</td><td>Description</td></tr>
      </thead>
      <tbody>
      ${rows?.map(m => /* html */`<tr><td>${m.name}</td><td><code>${m.type?.text ?? ''}</code></td><td>${m.description ?? ''}</td></tr>`).join('')}
      </tbody>
    </table>` : '';
}