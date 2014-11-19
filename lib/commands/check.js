var request = require('request'),
    when = require('when'),
    MissingArgumentException = require('../exceptions/missing-argument-exception');

exports.usage = function () {
    return "check <check-name> - Get check details";
};

exports.execute = function (config, name) {
    if (!name) {
        throw new MissingArgumentException();
    }

    return when.resolve();
};

