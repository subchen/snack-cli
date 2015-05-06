var assert = require('assert');
var util = require('util');
var cli = require('../');

/* jshint mocha: true */
describe('cli', function() {

    var equal = assert.strictEqual;

    it('--help', function() {
        var info = [];
        console.info = function() {
            info.push(util.format.apply(util, arguments));
        };

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
            equal(info.join('\n'), helps.join('\n'));
        };

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
            .parse(['--help']);
    });

});
