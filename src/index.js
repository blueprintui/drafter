#!/usr/bin/env node

import { glob, fs, path } from 'zx';
import { spinner } from 'zx/experimental';
import { fileURLToPath } from 'url';
import { createIFrames } from './frame.js';
import { createManager } from './manager.js';
import { program } from 'commander';
import { rollup, watch } from 'rollup';
import { getConfig } from './config.js';
import { loadConfigFile } from 'rollup/loadConfigFile';
import chokidar from 'chokidar';
import Prism from 'prismjs';
import prettier from 'prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const status = {
  error: '\x1b[31m%s\x1b[0m',
  warn: '\x1b[33m%s\x1b[0m',
  info: '\x1b[36m%s\x1b[0m',
  success: '\x1b[32m%s\x1b[0m'
};

let project = { };

program
  .command('build')
  .option('--config', 'path for custom config')
  .option('--watch')
  .description('build library')
  .action(async (options, command) => {
    process.env.DRAFTER_CONFIG = command.args[0] ? path.resolve(command.args[0]) : path.resolve('./blueprint.config.js');
    project = await getConfig();
    project.baseUrl = !options.watch ? project.baseUrl : null;
    project.examples = glob.globbySync(project.examples);
    project.elements = project.schema ? fs.readJSONSync(project.schema).modules.flatMap(module => module.declarations).filter(d => d.customElement) : [];

    writeFiles((await buildStatic()).map(file => ({ path: path.resolve(project.dist, file.path), template: file.template })));

    if (options.watch) {
      chokidar.watch(project.examples).on('all', async (_event, updatedPath) => {
        const iframes = createIFrames(project, await getModules(project.examples.filter(p => p === updatedPath)));
        writeFiles(iframes.map(file => ({ path: path.resolve(project.dist, file.path), template: file.template })));
      });
    }

    options.watch ? watchRollup() : buildRollup();
  });

program.parse();

function buildRollup() {
  return loadConfigFile(path.resolve(__dirname, './rollup.config.mjs')).then(async ({ options, warnings }) => {
    return new Promise(async (resolve) => {
      if (warnings.count) {
        console.log(`${warnings.count} warnings`);
      }

      warnings.flush();

      const start = Date.now();
      let bundle;
      let buildFailed = false;
      try {
        bundle = await spinner('Building...', async () => await rollup(options[0]));
        await bundle.write(options[0].output[0]);
      } catch (error) {
        buildFailed = true;
        console.error(status.error, error);
      }
      if (bundle) {
        const end = Date.now();
        console.log(status.success, `Completed in ${(end - start) / 1000} seconds 🎉`);
        await bundle.close();
        resolve();
      }
      if (!watch) {
        process.exit(buildFailed ? 1 : 0);
      }
    });
  });
}

function watchRollup() {
  loadConfigFile(path.resolve(__dirname, './rollup.config.mjs'), { watch: true }).then(async ({ options }) => {
    const watcher = watch(options[0]);

    try {
      watcher.on('event', (event) => {
        if (event.result) {
          event.result.watchFiles = null;
        }

        switch (event.code) {
          case 'START':
            console.log(status.info, 'Building...');
            break;
          case 'ERROR':
            console.error(status.error, event.error);
            event.result?.close();
            break;
          case 'WARN':
            console.error(status.error, event.error);
            break;
          case 'BUNDLE_END':
            console.log(status.success, `Complete in ${event.duration / 1000} seconds`);
            event.result?.close();
            break;
        }
      });
    } catch (error) {
      console.error(error);
    }

    watcher.on('event', ({ result }) => result?.close());
  });
}

function writeFiles(files) {
  files.flat(files).forEach(async (file) => {
    await fs.createFile(file.path);
    await fs.writeFile(file.path, file.template);
  });
}

async function buildStatic() {
  const modules = await getModules();
  writeFiles([{ path: path.resolve(project.dist, 'schema.json'), template: JSON.stringify(modules, null, 2) }]);

  return [
    ...createManager(project, modules),
    ...createIFrames(project, modules),
  ];
}

function getModules(examples = project.examples) {
  return Promise.all(examples.map(async (path) => {
    const module = await import(`${path}?update=${Date.now()}`);
    const examples = Object.keys(module).filter(k => k !== 'metadata').map(name => {
      const src = prettier.format(module[name](), { parser: 'html', singleAttributePerLine: false, printWidth: 180, singleQuote: true }).trim();
      const formattedSrc = Prism.highlight(src, Prism.languages.html, 'html');
      return {
        name: name.replace(/[A-Z]/g, l => `-${l.toLowerCase()}`),
        src,
        formattedSrc
      };
    });

    if (module.metadata?.elements) {
      module.metadata.elements = module.metadata.elements.map(e => project.elements.find(i => i.tagName === e)).filter(e => !!e);
    }

    return {
      name: module.metadata.name,
      elements: module.metadata.elements ?? [],
      examples
    };
  }));
}
