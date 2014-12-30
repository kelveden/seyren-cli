var request = require('request'),
    when = require('when'),
    home = require('../home'),
    printer = require('../printer'),
    alertAnalyzer = require('../alert-analyzer'),
    _ = require('lodash'),
    moment = require('moment'),
    Seyren = require('../api');

require('colors');

exports.usage = function () {
    return "dashboard - Status summary of favourite checks";
};

exports.execute = function (config) {
    var seyren = new Seyren(config),
        favourites = home.loadFavourites();

    function addAlertDurations(check) {
        return seyren.getAlertsForCheckSince(check.id)
            .then(function (alerts) {
                return when.resolve(alertAnalyzer.calculateTotalAlertDurations(alerts));
            })
            .then(_.partial(_.merge, check));
    }

    return when.map(favourites, seyren.getCheckById)
        .then(function (checks) {
            return when.map(checks, addAlertDurations);
        });
};

exports.format = function (checks) {
    home.saveLastSearch(checks);

    return checks
        .map(function (check, index) {
            var oneBasedIndex = index + 1;
            return "[" + oneBasedIndex.toString().cyan + "] " +
                "[" + check.id.yellow + "] " + check.name + " " +
                printer.printCheckStatus(check) + " " +
                (check.ERROR > 0 ? (" " + moment.duration(check.ERROR).humanize() + " ").red.inverse + " " : "") +
                (check.WARN > 0 ? (" " + moment.duration(check.WARN).humanize() + " ").yellow.inverse : "");
        })
        .join("\n");
};