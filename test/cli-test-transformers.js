var assert = require('assert');
var cli = require('../');
var test = require('./cli-test-utils');
var transformers = cli.transformers;

/* jshint mocha: true */
describe('cli', function() {

    var equal = assert.strictEqual;
    var deepEqual = assert.deepEqual;

    beforeEach(test.setup);
    afterEach(test.cleanup);

    cli = new cli.CLI();
    cli.name('sftp')
        .option('-n <n>', '', transformers.asNumber)
        .option('-i <i>', '', transformers.asInt)
        .option('-f <f>', '', transformers.asFloat)
        .option('-b <b>', '', transformers.asBoolean)
        .option('-l <list...>', '', transformers.asList)
        .option('--auth <user:pass>', '', function(value, argv) {
            var pairs = value.split(':');
            argv.authUser = pairs[0];
            argv.authPass = pairs[1];
            return value;
        })
        .allowMissingRequiredOption();

    it('transformers-number', function() {
        var argv = cli.parse([
            '-n', '0',
            '-i', '1',
            '-f', '1.11'
        ]);
        equal(argv.n, 0);
        equal(argv.i, 1);
        equal(argv.f, 1.11);
    });

    it('transformers-boolean', function() {
        var argv = cli.parse(['-b', 'true']);
        equal(argv.b, true);

        argv = cli.parse(['-b', 'yes']);
        equal(argv.b, true);

        argv = cli.parse(['-b', 'on']);
        equal(argv.b, true);

        argv = cli.parse(['-b', '1']);
        equal(argv.b, true);

        argv = cli.parse(['-b', 'false']);
        equal(argv.b, false);

        argv = cli.parse(['-b', 'no']);
        equal(argv.b, false);

        argv = cli.parse(['-b', 'off']);
        equal(argv.b, false);

        argv = cli.parse(['-b', '0']);
        equal(argv.b, false);
    });

    it('transformers-list', function() {
        var argv = cli.parse([
            '-l', '1,2,3',
        ]);
        deepEqual(argv.l, ['1', '2', '3']);
    });

    it('transformers-customize', function() {
        var argv = cli.parse([
            '--auth', 'admin:default'
        ]);
        equal(argv.auth, 'admin:default');
        equal(argv.authUser, 'admin');
        equal(argv.authPass, 'default');
    });
});
