[![Build Status](https://travis-ci.org/subchen/snack-cli.svg?branch=master)](https://travis-ci.org/subchen/snack-cli)
[![Code Coverage](https://img.shields.io/coveralls/subchen/snack-cli/master.svg)](https://coveralls.io/r/subchen/snack-cli)
[![NPM Repo](https://img.shields.io/npm/v/snack-cli.svg)](https://www.npmjs.com/package/snack-cli)
[![License](http://img.shields.io/badge/License-Apache_2-red.svg?style=flat)](http://www.apache.org/licenses/LICENSE-2.0)

**SNACK-CLI** is command-line interfaces for node.js

# Install by npm

```shell
npm install snack-cli
```

# Example

```js
var cli = require('snack-cli');

var argv = cli
    .name('sftp')
    .version('1.0.0-beta')
    .usage('[options] local remote')
    .description('An sftp application written by node.js')
    .option('    --host <host>', 'remote ssh hostname/ip')
    .option('    --port <port>', 'remote ssh port', '22', cli.transformers.asInt)
    .option('-u, --username <user>', 'username for authentication', 'root')
    .option('-p, --password <pass>', 'password for authentication')
    .option('    --auto-mkdirs', 'mkdirs when dir not found')
    .allowArgumentCount(2)
     //.allowUnknownOption()
     //.allowMissingRequiredOption()
    .parse();

console.log(argv);
```

When you execute following cli:

```shell
sftp --host 192.168.0.254 -p 111111 --auto-mkdirs ./1.txt /tmp/1.txt
```

You will get:

```
{
    'host': '192.168.0.254',
    'port': 22,
    'username': 'root',
    'password': '111111',
    'autoMkdirs': true,
    'args': [
        './1.txt',
        '/tmp/1.txt'
    ]
}
```

# Output help


When you execute following cli:

```shell
sftp --help
```

You will get:

```
Usage: sftp [options] local remote

An sftp application written by node.js

Options:
      --host <host>       remote ssh hostname/ip
      --port <port>       remote ssh port (default: 22)
  -u, --username <user>   username for authentication (default: root)
  -p, --password <pass>   password for authentication
      --auto-mkdirs       mkdirs when dir not found
      --version           display version information and exit
      --help              display this help and exit
```

# License

Released under the [Apache 2 License](http://www.apache.org/licenses/LICENSE-2.0).
