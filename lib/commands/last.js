var request = require('request'),
    when = require('when'),
    home = require('../home');

require('colors');

exports.usage = function () {
    return "last - Display results from the last search";
};

exports.execute = function () {
    return when.resolve(home.loadLastSearch());
};

exports.format = function (body) {
    return body
        .map(function (check, index) {
            var oneBasedIndex = index + 1;
            return "[" + oneBasedIndex.toString().cyan + "] [" + check.id.yellow + "] " + check.name;
        })
        .join("\n");
};