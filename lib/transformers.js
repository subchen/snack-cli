module.exports.noop = function(value) {
    return value;
};

module.exports.asNumber = function(value) {
    return parseInt(value);
};

module.exports.asBoolean = function(value) {
    return !!value;
};

module.exports.asList = function(value) {
    return value.split(',');
};
