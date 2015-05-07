module.exports.noop = function noop(value) {
    return value;
};

module.exports.asNumber = function asNumber(value) {
    return Number(value);
};

module.exports.asInt = function asInt(value) {
    return parseInt(value);
};

module.exports.asFloat = function asFloat(value) {
    return parseFloat(value);
};

module.exports.asBoolean = function asBoolean(value) {
    value = (value || '').toLowerCase();
    return value === 'true' || value === '1' || value === 'yes' || value === 'on';
};

module.exports.asList = function asList(value) {
    return value.split(',');
};
