## CLI for snappyjs

Simple stdio-capable CLI utility for [node-snappy](https://github.com/kesla/node-snappy).

```
snappy [input] [output]

Commands:
  snappy c [input] [output]                        [default] [aliases: compress]
  snappy d [input] [output]                                [aliases: decompress]

Options:
      --version   Show version number                                  [boolean]
  -i, --input     file path or will read from stdin             [default: stdin]
  -o, --output    file path or will write to stdout            [default: stdout]
  -k, --encoding  input data encoding                          [default: "utf8"]
  -h, --help      Show help                                            [boolean]
```
