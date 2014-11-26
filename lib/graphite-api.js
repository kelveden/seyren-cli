var request = require('request'),
    when = require('when'),
    open = require('open'),
    _ = require('lodash');

module.exports = function (config) {
    function callGraphite(options) {
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

    this.getDatapoints = function (target, from) {
        var options = {
            url: config.graphiteUrl + "/render",
            qs: {
                target: target,
                from: from,
                format: "json"
            }
        };

        return callGraphite(options);
    };
};
