var util = require('util');

var defaultConsoleInfo = console.info;
var defaultConsoleError = console.error;
var defaultProcessExit = process.exit;

module.exports.setup = function() {
    var infos = [];
    console.info = function() {
        infos.push(util.format.apply(util, arguments));
    };
    console.infoGet = function() {
        return infos.join('\n');
    };

    var errors = [];
    console.error = function() {
        errors.push(util.format.apply(util, arguments));
    };
    console.errorGet = function() {
        return errors.join('\n');
    };

    process.exit = function() {
        throw new Error('unexcepted process.exit(), errors:\n' + console.errorGet());
    };
};

module.exports.cleanup = function() {
    console.info = defaultConsoleInfo;
    console.error = defaultConsoleError;
    process.exit = defaultProcessExit;
};
