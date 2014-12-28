var MissingArgumentException = require('../exceptions/missing-argument-exception'),
    idResolver = require('../id-resolver'),
    Seyren = require('../api');

exports.usage = function () {
    return "open <check-id>|<ref> - Open check in browser";
};

exports.execute = function (config, idOrIndex) {

    if (!idOrIndex) {
        throw new MissingArgumentException();
    }

    var seyren = new Seyren(config);

    return seyren.openCheck(idResolver(idOrIndex))
        .then(function (url) {
            return "Opened " + url;
        });
};

exports.format = function (body) {
    return body;
};
