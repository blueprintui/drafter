import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, '../projects/example/.drafter/schema.json');

describe('Schema JSON Output', () => {
  before(() => {
    // Build the example project to generate schema.json
    execSync('pnpm run ci', { cwd: resolve(__dirname, '..'), stdio: 'pipe' });
  });

  it('should generate schema.json file', () => {
    assert.strictEqual(existsSync(schemaPath), true, 'schema.json should exist');
  });

  it('should have valid JSON structure', () => {
    const content = readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(content);

    assert.strictEqual(Array.isArray(schema), true, 'schema should be an array');
    assert.strictEqual(schema.length, 1, 'schema should have one module');
  });

  it('should have correct module metadata', () => {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const module = schema[0];

    assert.strictEqual(module.name, 'badge', 'module name should be "badge"');
    assert.strictEqual(Array.isArray(module.elements), true, 'elements should be an array');
    assert.strictEqual(Array.isArray(module.examples), true, 'examples should be an array');
  });

  it('should have three examples', () => {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const { examples } = schema[0];

    assert.strictEqual(examples.length, 3, 'should have 3 examples');
  });

  it('should have correct example properties', () => {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const { examples } = schema[0];

    for (const example of examples) {
      assert.strictEqual(typeof example.name, 'string', 'example name should be a string');
      assert.strictEqual(typeof example.src, 'string', 'example src should be a string');
      assert.strictEqual(typeof example.formattedSrc, 'string', 'example formattedSrc should be a string');
      assert.strictEqual(example.src.length > 0, true, 'example src should not be empty');
      assert.strictEqual(example.formattedSrc.length > 0, true, 'example formattedSrc should not be empty');
    }
  });

  it('should convert camelCase function names to kebab-case', () => {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const { examples } = schema[0];
    const names = examples.map(e => e.name);

    assert.strictEqual(names.includes('example'), true, 'should have "example"');
    assert.strictEqual(names.includes('number'), true, 'should have "number"');
    assert.strictEqual(names.includes('long-form'), true, 'should have "long-form" (converted from longForm)');
  });

  it('should include @summary JSDoc comments', () => {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const { examples } = schema[0];

    const exampleWithSummary = examples.find(e => e.name === 'example');
    const numberWithSummary = examples.find(e => e.name === 'number');
    const longFormWithSummary = examples.find(e => e.name === 'long-form');

    assert.strictEqual(
      exampleWithSummary.summary,
      'Badge examples showing all available status variants',
      'example should have correct summary'
    );
    assert.strictEqual(
      numberWithSummary.summary,
      'Badge with numeric content in different status variants',
      'number should have correct summary'
    );
    assert.strictEqual(
      longFormWithSummary.summary,
      'Badge displaying version numbers across all status variants',
      'longForm should have correct summary'
    );
  });

  it('should format HTML source correctly', () => {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const { examples } = schema[0];
    const example = examples.find(e => e.name === 'example');

    // Verify src contains expected HTML elements
    assert.strictEqual(example.src.includes('<ui-badge>'), true, 'src should contain ui-badge elements');
    assert.strictEqual(example.src.includes('bp-layout'), true, 'src should contain bp-layout attribute');

    // Verify formattedSrc contains Prism highlighting tokens
    assert.strictEqual(example.formattedSrc.includes('class="token'), true, 'formattedSrc should contain Prism tokens');
  });
});
