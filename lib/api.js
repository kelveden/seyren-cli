var request = require('request'),
    when = require('when'),
    open = require('open'),
    _ = require('lodash');

module.exports = function (config) {
    function callSeyren(options) {
        var deferred = when.defer();

        request.get(_.merge(options, { json: true }),
            function (error, response, body) {
                if (!error) {
                    deferred.resolve(body);
                } else {
                    deferred.reject(error);
                }
            });

        return deferred.promise;
    }

    this.searchChecks = function (text) {
        var options = {
                url: config.seyrenUrl + "/api/checks"
            };

        if (text) {
            options.qs = { regexes: ".*" + text + ".*", fields: "name" };
        }

        return callSeyren(options);
    };

    this.getCheckById = function (checkId) {
        var options = {
            url: config.seyrenUrl + "/api/checks/" + checkId
        };

        return callSeyren(options);
    };

    this.getCheckImageById = function (checkId) {
        return request.get(config.seyrenUrl + "/api/checks/" + checkId + "/image");
    };

    this.openCheck = function (checkId) {
        var url = config.seyrenUrl + "/#/checks/" + checkId;
        open(url);

        return when.resolve(url);
    };
};
