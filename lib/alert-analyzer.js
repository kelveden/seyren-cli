var _ = require('lodash'),
    moment = require('moment');

/**
 * Derives the alert spans given the specified ordered list of alerts. A "span" is simply
 * the timestamp range between the transition to an alert level and its transition to something
 * else.
 *
 * @returns Array of span objects.
 */
exports.getSpans = function (alerts, samplePeriod) {
    var safeSamplePeriod = samplePeriod || {},
        samplePeriodStart = safeSamplePeriod.start || moment().subtract(1, "days").unix() * 1000,
        samplePeriodEnd = safeSamplePeriod.end || moment().unix() * 1000;

    function openSpanFrom(start, type) {
        return {
            start: start,
            type: type
        };
    }

    function closeSpanAt(span, end) {
        span.end = end;
        span.duration = _.max([0,
                _.min([ span.end, samplePeriodEnd ]) -
                _.max([ span.start, samplePeriodStart ])]);
    }

    function isAtEndOfSpan(alert) {
        return (alert.fromType !== "OK") && (alert.fromType !== alert.toType);
    }

    function isAtStartOfSpan(alert) {
        return (alert.toType !== "OK") && (alert.fromType !== alert.toType);
    }

    return alerts
        .reduce(function (result, alert) {
            var latestSpan = result[result.length - 1];

            if (latestSpan && !latestSpan.end) {
                if (isAtEndOfSpan(alert) && (alert.toType !== latestSpan.type)) {
                    closeSpanAt(latestSpan, alert.timestamp);
                }
            } else {
                if (isAtStartOfSpan(alert)) {
                    result.push(
                        openSpanFrom(alert.timestamp, alert.toType));
                }
            }

            return result;
        }, []);
};

/**
 * Calculates the duration of each specified alert span, boxing the durations
 * within a specified sample period range. So, only the parts of each span NOT overlapping
 * the sample period range will be considered in the calculations.
 *
 * @returns The passed in spans with a duration field added.
 */
exports.calculateDurationsOf = function (spans, samplePeriod) {
    return spans.map(function (span) {
        return _.merge(span, {
            duration: _.max([0,
                    _.min([ span.end, samplePeriod.end ]) -
                    _.max([ span.start, samplePeriod.start ])])
        });
    });
};

/**
 * Adds up the total of all durations in the specified alert spans.
 *
 * @returns Integer
 */
exports.calculateTotalAlertDurations = function (alerts) {
    return exports.getSpans(_.sortBy(alerts, "timestamp"))
        .reduce(function (prev, next) {
            prev[next.type] = prev[next.type] + next.duration;
            return prev;
        }, { WARN: 0, ERROR: 0 });
};