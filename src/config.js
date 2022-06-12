import { resolve } from 'path';

const cwd = process.cwd();

export async function getConfig() {
  let userConfig = { };

  if (process.env.WEBPAD_CONFIG !== 'false') {
    userConfig = await import(process.env.WEBPAD_CONFIG);
  }

  const config = {
    dist: './dist/webpad',
    schema: null,
    examples: '**/element.examples.js',
    aliases: [],
    head: () => '',
    ...userConfig.default.webpad
  };

  return {
    ...config,
    dist: resolve(cwd, config.dist),
    schema: config.schema ? resolve(cwd, config.schema) : null,
    examples: resolve(cwd, config.examples)
  }
}
