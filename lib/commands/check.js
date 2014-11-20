var request = require('request'),
    when = require('when'),
    MissingArgumentException = require('../exceptions/missing-argument-exception'),
    _ = require('lodash'),
    home = require('../home');

require('colors');

exports.usage = function () {
    return "check <check-id>|<ref> - Get check details";
};

exports.execute = function (seyren, idOrRef) {
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

    if (!idOrRef) {
        throw new MissingArgumentException();
    }

    var id;
    if (_.isFinite(idOrRef)) {
        var ref = parseInt(idOrRef);
        id = home.loadLastSearch()[ref - 1].id;
    } else {
        id = idOrRef;
    }

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

    return seyren.getCheckById(id)
        .then(function (body) {
            var headerColour = body.enabled ? "green" : "red";

            return "====================================="[headerColour] + "\n" +
                body.name[headerColour] + " (" + (body.enabled ? "ON" : "OFF")[headerColour] + ")\n" +
                "====================================="[headerColour] + "\n" +
                "Id: ".cyan + body.id.yellow + "\n" +
                "Target: ".cyan + body.target + "\n" +
                "Subscriptions: ".cyan + "\n" +
                subscriptions(body);
        });
};

