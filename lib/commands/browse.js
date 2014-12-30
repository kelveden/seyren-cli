var open = require('./open');

exports.usage = function () {
    return "browse <check-id>|<ref> - Synonym for 'open'";
};

exports.execute = open.execute;
exports.format = open.format;