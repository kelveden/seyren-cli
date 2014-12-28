var request = require('request'),
    when = require('when'),
    home = require('../home'),
    printer = require('../printer'),
    Seyren = require('../api');

require('colors');

exports.usage = function () {
    return "dashboard - Status summary of favourite checks";
};

exports.execute = function (config, text) {
    var seyren = new Seyren(config),
        favourites = home.loadFavourites();

    return when.map(favourites, seyren.getCheckById);
};

exports.format = function (checks) {
    home.saveLastSearch(checks);

    return checks
        .map(function (check, index) {
            var oneBasedIndex = index + 1;
            return "[" + oneBasedIndex.toString().cyan + "] [" + check.id.yellow + "] " + check.name + " " + printer.printCheckStatus(check);
        })
        .join("\n");
};