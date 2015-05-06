var assert = require('assert');
var util = require('util');
var cli = require('../');

/* jshint mocha: true */
describe('cli', function() {

    var equal = assert.strictEqual;

    it('--version', function() {
        var info = [];
        console.info = function() {
            info.push(util.format.apply(util, arguments));
        };

        process.exit = function(code) {
            equal(code, 0);
            equal(info.join('\n'), '1.0.0-beta');
        };

        cli = new cli.CLI();
        cli.name('sftp')
            .version('1.0.0-beta')
            .parse(['--version']);
    });

});
