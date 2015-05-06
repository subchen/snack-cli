var assert = require('assert');
var cli = require('../');

/* jshint mocha: true */
describe('cli', function() {

    var deepEqual = assert.deepEqual;

    it('argv parse', function() {
        cli = new cli.CLI();
        cli.name('sftp')
            .version('1.0.0-beta')
            .usage('[options] local remote')
            .description('An sftp application written by node.js')
            .option('    --host <host>', 'remote ssh hostname/ip')
            .option('    --port <port>', 'remote ssh port', '22', cli.asNumber)
            .option('-u, --username <user>', 'username for authentication', 'root')
            .option('-p, --password <pass>', 'password for authentication')
            .option('    --auto-mkdirs', 'mkdirs when dir not found')
            .allowArgumentCount(2)

        var argv = cli.parse([
            '--host', '192.168.0.254',
            '-p', '111111',
            '--auto-mkdirs',
            './1.txt', '/tmp/1.txt'
        ]);

        deepEqual(argv, {
            'host': '192.168.0.254',
            'port': 22,
            'username': 'root',
            'password': '111111',
            'autoMkdirs': true,
            'args': [
                './1.txt',
                '/tmp/1.txt'
            ]
        });
    });

});
