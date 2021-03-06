# jy_ho
`jy_ho` (pronounced "jai ho"), is a no-fuss CLI to get/set json/yaml config files.

The only assumption it makes is that file-contents are an object (as opposed to an array or other valid json/yaml forms). The primary purpose of the utility is to get/set
values of config files from scripts.

## Install

```
npm i jy_ho
```

```
yarn add jy_ho
```

## Usage

```
No-fuss CLI to get/set json/yaml properties in file

 Usage: jy_ho <filepath> [dotPath] [val]

    filepath : must be valid json/yaml files (expects objects)
    dotPath  : a dotted key path 'a.b.c'. When absent, prints the whole file
    val      : if specified, sets the value, else prints value to stdout

 Examples:
    # get a value
    jy_ho some/file.json  a.b.c

    # set a value
    jy_ho some/file.json  a.b.c 42

    # push to (end of) array
    jy_ho some/file.json  a.b.arr.[] 42

    # push to (head of) array
    jy_ho some/file.json  a.b.arr.[0] 42

```