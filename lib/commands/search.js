var request = require('request'),
    when = require('when'),
    home = require('../home'),
    printer = require('../printer'),
    Seyren = require('../api');

require('colors');

exports.usage = function () {
    return "search <text> - Search for checks";
};

exports.execute = function (config, text) {
    var seyren = new Seyren(config);

    return seyren.searchChecks(text)
        .then(function (body) {
            var sorted = body.values
                .sort(function (check1, check2) {
                    return check1.name.localeCompare(check2.name);
                });

            home.saveLastSearch(sorted);

            return sorted;
        });
};

exports.format = function (body) {
    return body
        .map(function (check, index) {
            var oneBasedIndex = index + 1;
            return "[" + oneBasedIndex.toString().cyan + "] [" + check.id.yellow + "] " + check.name + " " + printer.printCheckStatus(check);
        })
        .join("\n");
};