import { resolve } from 'path';

const cwd = process.cwd();

export async function getConfig() {
  let userConfig = { };

  if (process.env.DRAFTER_CONFIG !== 'false') {
    userConfig = await import(process.env.DRAFTER_CONFIG);
  }

  const config = {
    dist: './dist/drafter',
    schema: null,
    examples: '**/element.examples.js',
    aliases: [],
    head: () => '',
    ...userConfig.default.drafter
  };

  return {
    ...config,
    dist: resolve(cwd, config.dist),
    schema: config.schema ? resolve(cwd, config.schema) : null,
    examples: resolve(cwd, config.examples)
  }
}
