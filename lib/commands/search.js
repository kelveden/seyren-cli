var request = require('request'),
    when = require('when');

exports.usage = function () {
    return "search [<text>] - Search for checks";
};

exports.execute = function (config, text) {
    var deferred = when.defer(),
        options = {
            url: config.seyrenUrl + "/api/checks",
            json: true
        };

    if (text) {
        options.qs = { regexes: ".*" + text + ".*", fields: "name" };
    }

    request.get(options,
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

