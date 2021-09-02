import { promises as fs_ } from 'fs';
import dotProp from 'dot-prop';
import YAML from 'js-yaml';
import jyho from '../src/index';

const fs = {
  readTextFile: (filepath: string) => fs_.readFile(filepath, 'utf8'),
  writeTextFile: (filepath: string, contents: string) =>
    fs_.writeFile(filepath, contents, 'utf8'),
};

const imports = {
  fs,
  YAML,
  dotProp,
  exit: process.exit,
};

describe('jyho', () => {
  it('json', async () => {
    const result = await jyho({
      args: [`${__dirname}/fixtures/sample.json`, 'some.nested.json'],
      imports,
    });
    expect(result).toEqual(true);
  });
  it('yaml', async () => {
    const result = await jyho({
      args: [`${__dirname}/fixtures/sample.yaml`, 'some.nested.yaml'],
      imports,
    });
    expect(result).toEqual(true);
  });
});
