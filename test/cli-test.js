var assert = require('assert');
var cli = require('../');

/* jshint mocha: true */
describe('cli', function() {

    var equal = assert.strictEqual;
    var deepEqual = assert.deepEqual;

    it('argv parse', function() {
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
        console.log(argv);

        cli.parse(['--help']);
    });

});
