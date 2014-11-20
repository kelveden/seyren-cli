var request = require('request'),
    when = require('when'),
    moment = require('moment'),
    MissingArgumentException = require('../exceptions/missing-argument-exception'),
    _ = require('lodash'),
    idResolver = require('../id-resolver');

require('colors');

exports.usage = function () {
    return "check <check-id>|<ref> - Get check details";
};

exports.execute = function (seyren, idOrRef) {

    if (!idOrRef) {
        throw new MissingArgumentException();
    }

    return seyren.getCheckById(idResolver(idOrRef));
};

exports.format = function (body) {
    var days = {
            su: "Sun",
            sa: "Sat",
            mo: "Mon",
            tu: "Tue",
            we: "Wed",
            th: "Thu",
            fr: "Fri"
        },
        alertLevels = [ "Warn", "Error", "Ok" ];

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

    function state(body) {
        if (body.state === "OK") {
            return " OK ".green.inverse;

        } else if (body.state === "WARN") {
            return " WARN ".yellow.inverse;

        } else if (body.state === "UNKNOWN") {
            return " UNKNOWN ".bgWhite.grey.inverse;

        } else if (body.state === "ERROR") {
            return " ERROR ".bgWhite.red.inverse;

        } else {
            return body.state;
        }
    }

    var headerColour = body.enabled ? "magenta" : "grey";

    return "=====================================" + "\n" +
        body.name[headerColour] + " (" + (body.enabled ? "ON" : "OFF")[headerColour] + ")\n" +
        "=====================================" + "\n" +
        "Id: ".cyan + body.id.yellow + "\n" +
        "Target: ".cyan + body.target + "\n" +
        "Status: ".cyan + state(body) + " [" + moment(body.lastCheck).toISOString().yellow + "]\n" +
        "Subscriptions: ".cyan + "\n" +
        subscriptions(body);
};
