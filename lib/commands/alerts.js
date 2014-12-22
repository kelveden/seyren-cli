var request = require('request'),
    when = require('when'),
    moment = require('moment'),
    MissingArgumentException = require('../exceptions/missing-argument-exception'),
    _ = require('lodash'),
    idResolver = require('../id-resolver'),
    parallel = require('when/parallel'),
    alertAnalyzer = require('../alert-analyzer');

require('colors');

exports.usage = function () {
    return "alerts <check-id>|<index> - Get recent alerts";
};

exports.execute = function (seyren, idOrIndex) {

    if (!idOrIndex) {
        throw new MissingArgumentException();
    }

    var checkId = idResolver(idOrIndex),
        samplePeriodStart = moment().subtract(1, "days").unix() * 1000,
        samplePeriodEnd = moment().unix() * 1000;

    var result;

    return seyren.getCheckById(checkId)
        .then(function (check) {
            result = check;
            return when.resolve(checkId);
        })
        .then(_.partialRight(seyren.getAlertsForCheckSince, samplePeriodStart))
        .then(function (alerts) {
            return when.resolve(_.merge(result, {
                alertSpans: alertAnalyzer.calculateDurationsOf(
                    alertAnalyzer.getSpans(_.sortBy(alerts, "timestamp")), {
                        start: samplePeriodStart,
                        end: samplePeriodEnd
                    })
            }));
        });
};

exports.format = function (body) {
    function durationText(type) {
        var milliseconds = alertAnalyzer.calculateTotalDurationOf(
            _.filter(body.alertSpans, { type: type}));

        if (milliseconds > 0) {
            return moment.duration(milliseconds).humanize();
        } else {
            return "-";
        }
    }

    var headerColour = body.enabled ? "magenta" : "grey";

    return "=====================================" + "\n" +
        body.name[headerColour] + " (" + (body.enabled ? "ON" : "OFF")[headerColour] + ")\n" +
        "=====================================" + "\n" +
        "WARN:".yellow + " " + durationText("WARN") + "\n" +
        "ERROR:".red + " " + durationText("ERROR");
};
