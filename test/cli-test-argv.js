var assert = require('assert');
var cli = require('../');
var test = require('./cli-test-utils');
var transformers = cli.transformers;

/* jshint mocha: true */
describe('cli', function() {

    var deepEqual = assert.deepEqual;

    beforeEach(test.setup);
    afterEach(test.cleanup);

    it('parse argv', function() {
        cli = new cli.CLI();
        cli.name('sftp')
            .option('    --host <host>', 'remote ssh hostname/ip')
            .option('    --port <port>', 'remote ssh port', '22', transformers.asInt)
            .option('-u, --username <user>', 'username for authentication', 'root')
            .option('-p, --password <pass>', 'password for authentication')
            .option('    --auto-mkdirs', 'mkdirs when dir not found');

        var argv = cli.parse([
            '--host=192.168.0.254',
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
