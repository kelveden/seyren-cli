var request = require('request'),
    when = require('when'),
    MissingArgumentException = require('../exceptions/missing-argument-exception');

exports.usage = function () {
    return "search <text> - Search for checks";
};

exports.execute = function (config, text) {
    if (!text) {
        throw new MissingArgumentException();
    }

    var deferred = when.defer();

    request.get({
            url: config.seyrenUrl + "/api/checks",
            qs: { regexes: ".*" + text + ".*", fields: "name" },
            json: true
        },
        function (error, response, body) {
            if (!error) {
                deferred.resolve(
                    body.values.map(function (alert) {
                        return alert.name;
                    }).sort().join("\n")
                );
            } else {
                deferred.reject(error);
            }
        });

    return deferred.promise;
};

