#!/usr/bin/env node

import { glob, fs, path } from 'zx';
import { spinner } from 'zx/experimental';
import { fileURLToPath } from 'url';
import { createIFrames } from './frame.js';
import { createManager } from './manager.js';
import { program } from 'commander';
import { rollup, watch } from 'rollup';
import { getConfig } from './config.js';
import chokidar from 'chokidar';
import loadConfigFile from 'rollup/loadConfigFile';
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
  .option('--prod')
  .description('build library')
  .action(async (options, command) => {
    process.env.DRAFTER_CONFIG = command.args[0] ? path.resolve(command.args[0]) : path.resolve('./blueprint.config.js');
    project = await getConfig();
    project.examples = glob.globbySync(project.examples);
    buildStatic(options.watch);
    await buildRollup(!options.watch);
    if (options.watch) {
      watchRollup();
    }
  });

program.parse();

async function buildStatic(watch) {
  const elements = project.schema ? fs.readJSONSync(project.schema).modules.flatMap(module => module.declarations).filter(d => d.customElement) : [];
  const modules = await getModules(elements);

  createManager(project, modules);
  createIFrames(project, modules);

  const schemaPath = path.resolve(project.dist, 'schema.json');
  fs.createFileSync(schemaPath);
  fs.writeFileSync(schemaPath, JSON.stringify(modules, null, 2));

  if (watch) {
    chokidar.watch(project.examples).on('all', async (event, path) => {
      createIFrames(project, await getModules(elements, path));
    });
  }
}

function getModules(elements, updatedPath) {
  const examplePaths = updatedPath ? project.examples.filter(p => p === updatedPath) : project.examples;

  return Promise.all(examplePaths.map(async (path) => {
    const module = await import(`${path}?update=${Date.now()}`);
    const examples = Object.keys(module).filter(k => k !== 'metadata').map(name => {
      const src = prettier.format(module[name]().replace('<template>', '').replace('</template>', ''), { parser: 'html', singleAttributePerLine: false, printWidth: 180, singleQuote: true }).trim();
      const formattedSrc = Prism.highlight(src, Prism.languages.html, 'html');
      return { name, src, formattedSrc };
    });

    if (module.metadata?.elements) {
      module.metadata.elements = module.metadata.elements.map(e => elements.find(i => i.tagName === e)).filter(e => !!e);
    }

    return {
      name: module.metadata.name,
      elements: module.metadata.elements ?? [],
      examples
    };
  }));
}

function buildRollup(exit) {
  return loadConfigFile(path.resolve(__dirname, './rollup.config.mjs'), {}).then(async ({ options, warnings }) => {
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
      if (exit) {
        process.exit(buildFailed ? 1 : 0);
      }
    });
  });
}

function watchRollup() {
  loadConfigFile(path.resolve(__dirname, './rollup-watch.config.mjs'), {}).then(async ({ options }) => {
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
              event.result.close();
              break;
            case 'WARN':
              console.error(status.error, event.error);
              break;
            case 'BUNDLE_END':
              console.log(status.success, `Complete in ${event.duration / 1000} seconds`);
              event.result.close();
              break;
          }
        });
      } catch (error) {
        console.error(error);
      }

      watcher.on('event', ({ result }) => result?.close());
    }
  );
}
