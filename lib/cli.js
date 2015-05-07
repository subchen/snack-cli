var path = require('path');
var _ = require('lodash');
var CLIOption = require('./clioption');
var Iterator = require('./iterator');
var transformers = require('./transformers');

/**
 * @example
 *
 * var argv = cli
 *     .name('fsync')
 *     .version('1.0.0-beta')
 *     .usage('[options] ...')
 *     .description('An application written by node.js')
 *     .option('    --host <host>', 'target hostname/ip')
 *     .option('    --port <port>', 'target port', '22', cli.transformers.asInt)
 *     .option('-u, --username <user>', 'username for authentication', 'root')
 *     .option('-p, --password <pass>', 'password for authentication', 'default')
 *     //.allowArgumentCount(0)
 *     //.allowUnknownOption()
 *     //.allowMissingRequiredOption()
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
    this._allowArgumentCount = Number.MAX_VALUE;
    this._allowUnknownOption = false;
    this._allowMissingRequiredOption = false;

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
CLI.prototype.allowMissingRequiredOption = function() {
    this._allowMissingRequiredOption = true;
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

    // clear it to support parse again
    this._argv = {
        args: []
    };

    while (it.hasNext()) {
        var arg = it.next();
        if (_.startsWith(arg, '-')) {
            if (!this._parseArg(it, arg)) {
                return;
            }
        } else {
            this._argv.args.push(arg);
        }
    }

    if (this._argv.help) {
        this.showHelp();
        return;
    }
    if (this._argv.version) {
        this.showVersion();
        return;
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

    if (option === undefined && !this._allowUnknownOption) {
        this._unknownOption(arg);
        return false;
    }

    var name = option.name();
    if (option.bool) {
        this._argv[name] = true;
        return true;
    }

    if (it.hasNext()) {
        var value = it.next();
        if (_.startsWith(value, '-')) {
            this._missingOptionArgument(option);
            return false;
        }
        this._argv[name] = option.transform(value, this._argv);
        return true;
    }

    this._missingOptionArgument(option);
    return false;
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
            var parts = arg.split('=', 2);
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
    var validated = this._options.every(function(option) {
        var name = option.name();
        if (self._argv[name] === undefined) {
            if (option.defaults !== undefined && option.defaults !== null) {
                self._argv[name] = option.transform(option.defaults, self._argv);
            } else if (option.required && !self._allowMissingRequiredOption) {
                self._missingRequiredOption(option);
                return false;
            }
        }
        return true;
    });

    if (!validated) {
        return;
    }

    if (this._argv.args.length > this._allowArgumentCount) {
        this._unacceptArgumentCount();
    }
};

/**
 * Display usage for '--version'
 */
CLI.prototype.showVersion = function() {
    console.info(this._version);
    process.exit(0);
};

/**
 * Display usage for '--help'
 */
CLI.prototype.showHelp = function() {
    console.info('Usage: %s %s', this._name, this._usage);
    console.info();

    if (this._description) {
        console.info(this._description);
        console.info();
    }

    console.info('Options:');

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
        console.info(s);
    });
    console.info();

    if (typeof this.showMoreHelps === 'function') {
        this.showMoreHelps();
    }

    process.exit(0);
};

CLI.prototype._unknownOption = function(name) {
    console.error();
    console.error('  error: unknown option `%s`', name);
    this._moreHelp();
};

CLI.prototype._missingRequiredOption = function(option) {
    console.error();
    console.error('  error: option `%s` missing', option.flags.trim());
    this._moreHelp();
};

CLI.prototype._missingOptionArgument = function(option) {
    console.error();
    console.error('  error: option `%s` argument missing', option.flags.trim());
    this._moreHelp();
};

CLI.prototype._unacceptArgumentCount = function() {
    console.error();
    console.error('  error: cannot accept more than %d arguments', this._argv.args.length);
    this._moreHelp();
};

CLI.prototype._moreHelp = function() {
    console.error();
    console.error('  Try `%s --help` for more information.', this._name);
    console.error();
    process.exit(1);
};

// exports
module.exports = new CLI();
module.exports.CLI = CLI;
