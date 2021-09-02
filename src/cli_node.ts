import { promises as fs_ } from 'fs';
import dotProp from 'dot-prop';
import YAML from 'js-yaml';
import jyho from './index';

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

jyho({
  args: process.argv.slice(2),
  imports,
  debug: !!process.env.DEBUG
}).then(console.log).catch(err => {
  console.error(err.message);
});
