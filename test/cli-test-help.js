var assert = require('assert');
var cli = require('../');
var test = require('./cli-test-utils');
var transformers = cli.transformers;

/* jshint mocha: true */
describe('cli', function() {

    var equal = assert.strictEqual;

    beforeEach(test.setup);
    afterEach(test.cleanup);

    it('--help', function() {
        var helps = [];
        helps.push('Usage: sftp [options] local remote');
        helps.push('');
        helps.push('An sftp application written by node.js');
        helps.push('');
        helps.push('Options:');
        helps.push('      --host <host>       remote ssh hostname/ip');
        helps.push('      --port <port>       remote ssh port (default: 22)');
        helps.push('  -u, --username <user>   username for authentication (default: root)');
        helps.push('  -p, --password <pass>   password for authentication');
        helps.push('      --auto-mkdirs       mkdirs when dir not found');
        helps.push('      --version           display version information and exit');
        helps.push('      --help              display this help and exit');
        helps.push('');

        process.exit = function(code) {
            equal(code, 0);
            equal(console.infoGet(), helps.join('\n'));
        };

        var cmd = new cli.CLI();
        cmd.name('sftp')
            .version('1.0.0-beta')
            .usage('[options] local remote')
            .description('An sftp application written by node.js')
            .option('    --host <host>', 'remote ssh hostname/ip')
            .option('    --port <port>', 'remote ssh port', '22', transformers.asInt)
            .option('-u, --username <user>', 'username for authentication', 'root')
            .option('-p, --password <pass>', 'password for authentication')
            .option('    --auto-mkdirs', 'mkdirs when dir not found')
            .parse(['--help']);
    });
    
    
    it('--help more', function() {
        var helps = [];
        helps.push('Usage: test [options] ...');
        helps.push('');
        helps.push('Options:');
        helps.push('  -f, --file <file>   file name');
        helps.push('      --help          display this help and exit');
        helps.push('');
        helps.push('Examples:');
        helps.push('  test -f 1.txt');
        helps.push('  test --filelist=1.txt');
        helps.push('');

        process.exit = function(code) {
            equal(code, 0);
            equal(console.infoGet(), helps.join('\n'));
        };

        var cmd = new cli.CLI();
        cmd.showMoreHelps = function() {
            console.info('Examples:');
            console.info('  test -f 1.txt');
            console.info('  test --filelist=1.txt');
            console.info('');
        };
        cmd.name('test')
            .option('-f, --file <file>', 'file name')
            .parse(['--help']);
    });
});
