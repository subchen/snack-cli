var assert = require('assert');
var cli = require('../');
var test = require('./cli-test-utils');

/* jshint mocha: true */
describe('cli', function() {

    var equal = assert.strictEqual;

    beforeEach(test.setup);
    afterEach(test.cleanup);

    it('--version', function() {
        process.exit = function(code) {
            equal(code, 0);
            equal(console.infoGet(), '1.0.0-beta');
        };

        cli = new cli.CLI();
        cli.name('sftp')
            .version('1.0.0-beta')
            .parse(['--version']);
    });

});
