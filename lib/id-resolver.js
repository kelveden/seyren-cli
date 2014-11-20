var home = require('./home'),
    _ = require('lodash');

module.exports = function (idOrRef) {

    var id;
    if (_.isFinite(idOrRef)) {
        var ref = parseInt(idOrRef);
        id = home.loadLastSearch()[ref - 1].id;
    } else {
        id = idOrRef;
    }

    return id;
};