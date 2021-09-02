let _debug = false;
const trace = (msg: string) => {
  if (_debug) {
    console.log(msg);
  }
};

export interface Imports {
  fs: {
    readTextFile: (fname: string) => Promise<string>;
    writeTextFile: (fname: string, contents: string) => Promise<unknown>;
  };
  YAML: {
    load: (str: string, opts?: any) => any;
    dump: (obj: any, opts?: any) => string;
  };
  dotProp: {
    get: <T>(
      object:
        | {
            [key: string]: any;
          }
        | undefined,
      path: string
    ) => T | undefined;
    set: <T extends { [key: string]: any }>(
      object: T,
      path: string,
      value: unknown
    ) => T;
  };
  exit: (code: number) => void;
}

enum TYPE {
  JSON,
  YAML,
}

export default async function({
  args,
  imports,
  debug,
}: {
  args: string[];
  imports: Imports;
  debug?: boolean;
}) {
  _debug = !!debug;
  const { fs, YAML, dotProp, exit } = imports;
  const { filepath, key, val } = parseArgs(args, exit);
  const { type, contents, input } = await parse(filepath);
  trace(JSON.stringify({ filepath, key, val, type }));
  if (val) {
    // set
    let modified;
    if (key.match(/\.\[\]$/)) {
      // user is requesting the value be appended to array
      const _key = key.replace(/\.\[\]$/, ``);
      const prev = dotProp.get(contents, _key) as Array<unknown>;
      modified = dotProp.set(contents, _key, prev.push(val));
    } else if (key.match(/\.\[0\]$/)) {
      // user is requesting the value be appended to array
      const _key = key.replace(/\.\[0\]$/, ``);
      const prev = dotProp.get(contents, _key) as Array<unknown>;
      modified = dotProp.set(contents, _key, prev.unshift(val));
    } else {
      modified = dotProp.set(contents, key!, val);
    }
    const output =
      type === TYPE.JSON
        ? JSON.stringify(modified, null, 2)
        : YAML.dump(modified);
    await fs.writeTextFile(filepath, output);
    trace(`updated "${key}: ${val}"`);
  } else if (key) {
    // get
    const val = dotProp.get(contents, key);
    return val;
  } else {
    return input;
  }

  async function parse(filepath: string) {
    const input = await fs.readTextFile(filepath);
    let contents: Object;
    try {
      contents = JSON.parse(input);
      return { input, contents, type: TYPE.JSON };
    } catch {
      contents = YAML.load(input) as Object;
      return { input, contents, type: TYPE.YAML };
    }
  }
}

function parseArgs(args: string[], exit: (n: number) => void) {
  const [filepath, key, val] = args;
  if (!filepath || filepath === '-h' || filepath === '--help') {
    console.log(
      [
        `No-fuss CLI to get/set json/yaml properties in file`,
        ``,
        ` Usage: jy_ho <filepath> [dotPath] [val]`,
        ``,
        `    filepath : must be valid json/yaml files (expects objects)`,
        `    dotPath  : a dotted key path 'a.b.c'. When absent, prints the whole file`,
        `    val      : if specified, sets the value, else prints value to stdout`,
        ``,
        ` Examples:`,
        `    # get a value`,
        `    jy_ho some/file.json  a.b.c`,
        ``,
        `    # set a value`,
        `    jy_ho some/file.json  a.b.c 42`,
        ``,
        `    # push to (end of) array`,
        `    jy_ho some/file.json  a.b.arr.[] 42`,
        ``,
        `    # push to (head of) array`,
        `    jy_ho some/file.json  a.b.arr.[0] 42`,
        ``,
      ].join('\n')
    );
    exit(filepath ? 0 : 1);
  }
  return { filepath, key, val };
}
