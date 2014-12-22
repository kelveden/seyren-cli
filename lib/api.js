var request = require('request'),
    when = require('when'),
    open = require('open'),
    _ = require('lodash');

module.exports = function (config) {
    var alertsPageSize = 100;

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

    function getAlertsSince(checkId, sinceTimestamp, startIndex) {
        var options = {
            url: config.seyrenUrl + "/api/checks/" + checkId + "/alerts",
            qs: { start: startIndex || 0, items: alertsPageSize }
        };

        return callSeyren(options)
            .then(function (data) {
                var alerts = data.values.filter(function (alert) {
                    return (alert.timestamp > sinceTimestamp);
                });

                if (alerts.length > 0) {
                    return getAlertsSince(checkId, sinceTimestamp, startIndex + alertsPageSize)
                        .then(function (moreAlerts) {
                           return _.union(alerts, moreAlerts);
                        });
                } else {
                    return when.resolve(alerts);
                }
            });
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

    this.getAlertsForCheck = function (checkId) {
        var options = {
            url: config.seyrenUrl + "/api/checks/" + checkId + "/alerts"
        };

        return callSeyren(options);
    };

    this.getAlertsForCheckSince = function (checkId, sinceTimestamp) {
        return getAlertsSince(checkId, sinceTimestamp, 0);
    };

    this.openCheck = function (checkId) {
        var url = config.seyrenUrl + "/#/checks/" + checkId;
        open(url);

        return when.resolve(url);
    };
};
