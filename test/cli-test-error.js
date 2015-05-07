var assert = require('assert');
var cli = require('../');
var test = require('./cli-test-utils');

/* jshint mocha: true */
describe('cli', function() {

    var equal = assert.strictEqual;

    var moreHelps = '\n\n  Try `sftp --help` for more information.\n';

    beforeEach(test.setup);
    afterEach(test.cleanup);

    it('unknown option', function() {
        process.exit = function(code) {
            equal(code, 1);
            equal(console.errorGet(), '\n  error: unknown option `--test`' + moreHelps);
        };
        var cmd = new cli.CLI();
        cmd.name('sftp').parse(['--test']);
    });

    it('missing required option', function() {
        process.exit = function(code) {
            equal(code, 1);
            equal(console.errorGet(), '\n  error: option `-f <file>` missing' + moreHelps);
        };
        var cmd = new cli.CLI();
        cmd.name('sftp').option('-f <file>').parse([]);
    });

    it('missing option argument, 1', function() {
        process.exit = function(code) {
            equal(code, 1);
            equal(console.errorGet(), '\n  error: option `-f <file>` argument missing' + moreHelps);
        };
        var cmd = new cli.CLI();
        cmd.name('sftp').option('-f <file>').parse(['-f']);
    });

    it('missing option argument, 2', function() {
        process.exit = function(code) {
            equal(code, 1);
            equal(console.errorGet(), '\n  error: option `-f <file>` argument missing' + moreHelps);
        };
        var cmd = new cli.CLI();
        cmd.name('sftp').option('-f <file>').option('-v').parse(['-f -v']);
    });

    it('cannot accept more arguments', function() {
        process.exit = function(code) {
            equal(code, 1);
            equal(console.errorGet(), '\n  error: cannot accept more than 2 arguments' + moreHelps);
        };
        var cmd = new cli.CLI();
        cmd.name('sftp').allowArgumentCount(1).parse(['1', '2']);
    });
});
