var path = require('path');
var _ = require('lodash');
var CLIOption = require('./clioption');
var transformers = require('./transformers');
var Iterator = require('./iterator');

/**
 * @example
 *
 * var argv = cli
 *     .name('fsync')
 *     .version('1.0.0-beta')
 *     .usage('[options] ...')
 *     .description('An application written by node.js')
 *     .option('    --host <host>', 'target hostname/ip')
 *     .option('    --port <port>', 'target port', '22', cli.asNumber)
 *     .option('-u, --username <user>', 'username for authentication', 'root')
 *     .option('-p, --password <pass>', 'password for authentication', 'default')
 *     .allowArgumentCount(0)
 *     .allowUnknownOption()
 *     .parse();
 */

/**
 * @class
 */
function CLI() {
    this._name = path.basename(process.argv[1]).slice(0, -3);
    this._version = null;
    this._usage = '[options] ...';
    this._description = null;

    this._options = [];
    this._allowUnknownOption = false;
    this._allowArgumentCount = Number.MAX_VALUE;

    // store parsed argv object
    this._argv = {
        args: []
    };
}

CLI.prototype.name = function(name) {
    this._name = name;
    return this;
};
CLI.prototype.version = function(version) {
    this._version = version;
    return this;
};
CLI.prototype.usage = function(usage) {
    this._usage = usage;
    return this;
};
CLI.prototype.description = function(description) {
    this._description = description;
    return this;
};

CLI.prototype.option = function(flags, description, defaults, transform) {
    if (typeof defaults === 'function' && transform === undefined) {
        transform = defaults;
        defaults = undefined;
    }
    transform = transform || transformers.noop;

    this._options.push(new CLIOption(flags, description, defaults, transform));
    return this;
};

CLI.prototype.allowArgumentCount = function(count) {
    this._allowArgumentCount = count;
    return this;
};
CLI.prototype.allowUnknownOption = function() {
    this._allowUnknownOption = true;
    return this;
};

/**
 * Parse argv.
 *
 * @param {array} [argv=process.argv.slice(2)]
 * @return {object} parsed argv object
 */
CLI.prototype.parse = function(argv) {
    argv = argv || process.argv.slice(2);
    var it = new Iterator(this._normalize(argv));

    if (this._version) {
        this.option('    --version', 'display version information and exit');
    }
    this.option('    --help', 'display this help and exit');

    while (it.hasNext()) {
        var arg = it.next();
        if (_.startsWith(arg, '-')) {
            this._parseArg(it, arg);
        } else {
            this._argv.args.push(arg);
        }
    }

    if (this._argv.help) {
        this.showHelp();
    }

    this._validateAndTransform();
    return this._argv;
};

/**
 * @private
 */
CLI.prototype._parseArg = function(it, arg) {
    var option = _.find(this._options, function(opt) {
        return opt.match(arg);
    });

    if (option === undefined) {
        this._unknownOption(arg);
    }

    var name = option.name();
    if (option.bool) {
        this._argv[name] = true;
        return;
    }

    if (it.hasNext()) {
        var value = it.next();
        if (_.startsWith(value, '-')) {
            this._missingOptionArgument(option);
        }
        this._argv[name] = option.transform(value, this._argv);
        return;
    }

    this._missingOptionArgument(option);
};

/**
 * Normalize `args`, splitting joined short flags. For example
 * the arg "-abc" is equivalent to "-a -b -c".
 * This also normalizes equal sign and splits "--abc=def" into "--abc def".
 *
 * @private
 * @param {array} argv
 * @return {array}
 */
CLI.prototype._normalize = function(argv) {
    var it = new Iterator(argv);
    argv = [];
    while (it.hasNext()) {
        var arg = it.next();
        if (_.startsWith(arg, '--')) {
            var parts = arg.split('=', 1);
            argv.push(parts[0]);
            if (parts.length > 1) {
                arg = parts[1];
                if (_.startsWith('"') && _.endsWith('"')) {
                    arg = arg.slice(1, -1);
                } else if (_.startsWith('\'') && _.endsWith('\'')) {
                    arg = arg.slice(1, -1);
                }
                argv.push(arg);
            }
        } else if (_.startsWith(arg, '-')) {
            for (var i = 1; i < arg.length; i++) {
                argv.push('-' + arg.charAt(i));
            }
        } else {
            argv.push(arg);
        }
    }
    return argv;
};

/**
 * validate, transform, set default value.
 *
 * @private
 */
CLI.prototype._validateAndTransform = function() {
    var self = this;
    this._options.forEach(function(option) {
        var name = option.name();
        if (self._argv[name] === undefined) {
            if (option.defaults !== undefined && option.defaults !== null) {
                self._argv[name] = option.transform(option.defaults, self._argv);
            } else if (option.required) {
                self._missingRequiredOption(option);
            }
        }
    });
    if (this._argv.length > this._allowArgumentCount) {
        this._unacceptArgumentCount();
    }
};

/**
 * Display usage for '--help'
 */
CLI.prototype.showHelp = function() {
    console.log('Usage: %s %s', this._name, this._usage);
    console.log();

    if (this.description) {
        console.log(this._description);
        console.log();
    }

    console.log('Options:');

    var maxlen = _.max(this._options, function(option) {
        return option.flags.length;
    }).flags.length + 2;

    this._options.forEach(function(option) {
        var s = '  ';
        s += _.padRight(option.flags, maxlen, ' ');
        s += ' ' + option.description;
        if (option.defaults) {
            s += ' (default: ' + option.defaults + ')';
        }
        console.log(s);
    });
    console.log();

    if (typeof this.showMoreHelps === 'function') {
        this.showMoreHelps();
    }

    process.exit(0);
};

CLI.prototype._unknownOption = function(name) {
    if (this._allowUnknownOption) {
        return;
    }
    console.error();
    console.error('  error: unknown option "%s"', name);
    this._moreHelp();
};

CLI.prototype._missingRequiredOption = function(option) {
    console.error();
    console.error('  error: option "%s" missing', option.flags.trim());
    this._moreHelp();
};

CLI.prototype._missingOptionArgument = function(option) {
    console.error();
    console.error('  error: option "%s" argument missing', option.flags.trim());
    this._moreHelp();
};

CLI.prototype._unacceptArgumentCount = function() {
    console.error();
    console.error('  error: cannot accept more than %d arguments', this._argv.length);
    this._moreHelp();
};

CLI.prototype._moreHelp = function() {
    console.error();
    console.error('  Try "%s --help" for more information.', this._name);
    console.error();
    process.exit(1);
};

// exports
module.exports = new CLI();
