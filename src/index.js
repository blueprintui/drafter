#!/usr/bin/env node

import { dirname, resolve } from 'path';
import glob from 'glob';
import { exec as _exec } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { createIFrames } from './frame.js';
import { createManager } from './manager.js';
import chokidar from 'chokidar';
import { program } from 'commander';
import loadConfigFile from 'rollup/loadConfigFile';
import { rollup, watch } from 'rollup';
import { getConfig } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ERROR = '\x1b[31m%s\x1b[0m';
const INFO = '\x1b[36m%s\x1b[0m';
const SUCCESS = '\x1b[32m%s\x1b[0m';
const cwd = process.cwd();
let project = { };

program
  .command('build')
  .option('--config', 'path for custom config')
  .option('--watch')
  .option('--prod')
  .description('build library')
  .action(async (options, command) => {
    process.env.DRAFTER_CONFIG = command.args[0] ? resolve(command.args[0]) : 'false';
    project = await getConfig();
    buildStatic(options.watch);
    await buildRollup(!options.watch);
    if (options.watch) {
      watchRollup();
    }
  });

program.parse();

async function buildStatic(watch) {
  let elements = [];
  let schema = { };

  if (project.schema) {
    schema = fs.readJSONSync(project.schema);
    elements = schema.modules.flatMap(module => module.declarations).filter(d => d.customElement);
  }

  const modules = await getModules(elements);

  createManager(project, modules);
  createIFrames(project, modules);

  if (watch) {
    chokidar.watch(project.examples).on('all', async (event, path) => {
      createIFrames(project, await getModules(elements, path));
    });
  }
}

function getModules(elements, updatedPath) {
  const paths = glob.sync(project.examples);
  const activePaths = updatedPath ? paths.filter(p => p === updatedPath) : paths;

  return Promise.all(activePaths.map(async (path) => {
    console.log(`updating: ${path.replace(resolve(cwd), '')}`);

    const module = await import(`${path}?update=${Date.now()}`);
    const examples = Object.keys(module).filter(k => k !== 'metadata').map(key => ({ fn: module[key], name: key }));

    if (module.metadata?.elements) {
      module.metadata.elements = module.metadata.elements.map(e => elements.find(i => i.tagName === e)).filter(e => !!e);
    }

    return { examples, path, metadata: module.metadata };
  }));
}

function buildRollup(exit) {
  return loadConfigFile(resolve(__dirname, './rollup.config.mjs'), {}).then(async ({ options, warnings }) => {
    return new Promise(async (resolve) => {
      if (warnings.count) {
        console.log(`${warnings.count} warnings`);
      }

      warnings.flush();

      const start = Date.now();
      let bundle;
      let buildFailed = false;
      try {
        console.log(INFO, 'Building...');
        bundle = await rollup(options[0]);
        await bundle.write(options[0].output[0]);
      } catch (error) {
        buildFailed = true;
        console.error(ERROR, error);
      }
      if (bundle) {
        const end = Date.now();
        console.log(SUCCESS, `Completed in ${(end - start) / 1000} seconds 🎉`);
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
  loadConfigFile(resolve(__dirname, './rollup-watch.config.mjs'), {}).then(async ({ options }) => {
      const watcher = watch(options[0]);

      try {
        watcher.on('event', (event) => {
          if (event.result) {
            event.result.watchFiles = null;
          }

          switch (event.code) {
            case 'START':
              console.log(INFO, 'Building...');
              break;
            case 'ERROR':
              console.error(ERROR, event.error);
              event.result.close();
              break;
            case 'WARN':
              console.error(ERROR, event.error);
              break;
            case 'BUNDLE_END':
              console.log(SUCCESS, `Complete in ${event.duration / 1000} seconds`);
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
