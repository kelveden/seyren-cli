var idResolver = require('../id-resolver'),
    fs = require('fs'),
    os = require('os'),
    when = require('when'),
    open = require('open'),
    exec = require('child_process').exec,
    MissingArgumentException = require('../exceptions/missing-argument-exception');

exports.usage = function () {
    return "view <check-id>|<index> - View check graph for last 24 hours";
};

exports.execute = function (seyren, idOrIndex) {

    if (!idOrIndex) {
        throw new MissingArgumentException();
    }

    var path = os.tmpdir() + "/seyren-graph";

    seyren.getCheckImageById(idResolver(idOrIndex))
        .pipe(fs.createWriteStream(path))
        .on('finish', function () {
            open(path);
        });

    return when.resolve("");
};

exports.format = function (body) {
    return body;
};