var MissingArgumentException = require('../exceptions/missing-argument-exception'),
    idResolver = require('../id-resolver');

exports.usage = function () {
    return "open <check-id>|<ref> - Open check in browser";
};

exports.execute = function (seyren, idOrRef) {

    if (!idOrRef) {
        throw new MissingArgumentException();
    }

    return seyren.openCheck(idResolver(idOrRef))
        .then(function (url) {
            return "Opened " + url;
        });
};

exports.format = function (body) {
    return body;
};
