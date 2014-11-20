var home = require('./home'),
    _ = require('lodash');

module.exports = function (idOrIndex) {

    var id;
    if (_.isFinite(idOrIndex)) {
        var index = parseInt(idOrIndex);
        id = home.loadLastSearch()[index - 1].id;
    } else {
        id = idOrIndex;
    }

    return id;
};