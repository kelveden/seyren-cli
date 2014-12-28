var MissingArgumentException = require('../exceptions/missing-argument-exception'),
    idResolver = require('../id-resolver'),
    home = require('../home'),
    when = require('when');

exports.usage = function () {
    return "favourite <check-id>|<ref> - Save check as a favourite";
};

exports.execute = function (config, idOrIndex) {

    if (!idOrIndex) {
        throw new MissingArgumentException();
    }

    var id = idResolver(idOrIndex);

    home.favourite(id);

    return when.resolve(id);
};

exports.format = function (id) {
    return "Favourited check " + id;
};
