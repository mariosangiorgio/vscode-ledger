# ledger
Adds support for [Ledger](http://www.ledger-cli.org) files.

## Features
* Syntax highlighting, based on the `Ledger.tmbundle` file created by [lifepillar](https://github.com/lifepillar/Ledger.tmbundle)

* Account name autocompletion using the output from [ledger-cli](https://github.com/slashdotdash/node-ledger)

* Reporting of malformed ledger files on save.

## Dependencies
Requires `ledger` to be in `/usr/local/bin/ledger` unless another path is specified in the Visual Studio Code configuration via the `ledger.binary` key.
