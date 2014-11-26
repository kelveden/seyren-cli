var request = require('request'),
    when = require('when'),
    moment = require('moment'),
    MissingArgumentException = require('../exceptions/missing-argument-exception'),
    _ = require('lodash'),
    idResolver = require('../id-resolver'),
    printer = require('../printer'),
    parallel = require('when/parallel'),
    chart = require('ascii-chart');

require('colors');

exports.usage = function () {
    return "check <check-id>|<index> - Get check details";
};

exports.execute = function (seyren, graphite, idOrIndex) {

    if (!idOrIndex) {
        throw new MissingArgumentException();
    }

    function lastAlertOfType(alerts, type) {
        if (!alerts) {
            return 0;
        }

        var matching = alerts.filter(function (alert) {
            return (alert.toType === type);
        });

        if (matching.length > 0) {
            return matching[0].timestamp;
        } else {
            return 0;
        }
    }

    var checkId = idResolver(idOrIndex);

    return parallel([
        seyren.getCheckById,
        seyren.getAlertsForCheck
    ], checkId)
        .then(function (results) {
            var check = results[0],
                alerts = results[1].values;

            return when.resolve(_.merge(check, {
                lastWarning: lastAlertOfType(alerts, "WARN"),
                lastError: lastAlertOfType(alerts, "ERROR")
            }));
        })
        .then(function (check) {
            return graphite.getDatapoints(check.target, "-1day")
                .then(function (datapoints) {
                    return _.merge(check, { datapoints: datapoints[0].datapoints });
                });
        });
};

exports.format = function (body) {
    function subscriptions(body) {
        return body.subscriptions.map(function (subscription) {
            return "-------------------------------------\n" +
                subscription.type.cyan + " [" + subscription.target.yellow + "]\n" +
                "[" + _.keys(days).map(function (seyrenDay) {
                var day = days[seyrenDay];
                return day[subscription[seyrenDay] ? "green" : "grey"];
            }).join(", ") + "]\n" +
                "[" + alertLevels.map(function (alertLevel) {
                return alertLevel[subscription["ignore" + alertLevel] ? "grey" : "green"];
            }).join(", ") + "]\n";
        }) + "-------------------------------------\n";
    }

    function graph(datapoints) {
        function scaleTo(values, columns) {
            var sampleWidth = Math.floor(values.length / columns);

            return _.range(columns).map(function (column) {
                return values[sampleWidth * column].toFixed(2);
            });
        }

        var values = datapoints.map(function (datapoint) {
            return datapoint[0];
        });

        return chart(scaleTo(values, 60), { height: 15, width: 150 });
    }

    var days = {
            su: "Sun",
            sa: "Sat",
            mo: "Mon",
            tu: "Tue",
            we: "Wed",
            th: "Thu",
            fr: "Fri"
        },
        alertLevels = [ "Warn", "Error", "Ok" ],
        headerColour = body.enabled ? "magenta" : "grey";

    return "=====================================" + "\n" +
        body.name[headerColour] + " (" + (body.enabled ? "ON" : "OFF")[headerColour] + ")\n" +
        "=====================================" + "\n" +
        "Id: ".cyan + body.id.yellow + "\n" +
        "Target: ".cyan + body.target + "\n" +
        "Status: ".cyan + printer.printCheckStatus(body) + " " + printer.printDateText(body.lastCheck) + "\n" +
        "Last Error: ".cyan + printer.printDateText(body.lastError) + "\n" +
        "Last Warning: ".cyan + printer.printDateText(body.lastWarning) + "\n" +
        "Subscriptions: ".cyan + "\n" +
        subscriptions(body) + "\n" +
        graph(body.datapoints);
};
