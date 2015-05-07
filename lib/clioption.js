var _ = require('lodash');

/**
 * @private
 */
function _matchGroup(flags, re, group) {
    var match = flags.match(re);
    return match ? match[group] : null;
}

/**
 * Initialize a new `CLIOption` with the given `flags` and `description`.
 *
 * @class
 *
 * @param {string} flags
 * @param {string} description
 * @param {string} [defaults]
 * @param {function(value, argv)} [transform]
 */
function CLIOption(flags, description, defaults, transform) {
    this.flags = flags;
    this.short = _matchGroup(flags, /(^|[ ,])(-[a-zA-Z])($|[ ,])/, 2);
    this.long = _matchGroup(flags, /(^|[ ,])(--[-a-zA-Z0-9]+)($|[ ,])/, 2);
    this.bool = flags.indexOf('<') === -1;

    this.required = (!this.bool) && (defaults == null);

    this.description = description || '';
    this.defaults = defaults;
    this.transform = transform;
}

/**
 * Return option name.
 *
 * @return {string}
 */
CLIOption.prototype.name = function() {
    if (this.long) {
        return _.camelCase(this.long.slice(2));
    }
    return this.short.slice(1);
};

/**
 * Check if `arg` matches the short or long flag.
 *
 * @param {string} arg
 * @return {boolean}
 */
CLIOption.prototype.match = function(arg) {
    return this.short === arg || this.long === arg;
};

// exports
module.exports = CLIOption;
