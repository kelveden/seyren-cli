var request = require('request'),
    when = require('when'),
    moment = require('moment'),
    MissingArgumentException = require('../exceptions/missing-argument-exception'),
    _ = require('lodash'),
    idResolver = require('../id-resolver'),
    printer = require('../printer'),
    Seyren = require('../api');

require('colors');

exports.usage = function () {
    return "check <check-id>|<index> - Get check details";
};

exports.execute = function (config, idOrIndex) {

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

    var seyren = new Seyren(config),
        checkId = idResolver(idOrIndex);

    return seyren.getCheckById(checkId)
        .then(function (data) {
            return seyren.getAlertsForCheck(checkId)
                .then(function (alerts) {
                    data.lastWarning = lastAlertOfType(alerts.values, "WARN");
                    data.lastError = lastAlertOfType(alerts.values, "ERROR");

                    return data;
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
        subscriptions(body);
};
