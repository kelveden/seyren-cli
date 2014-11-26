var moment = require('moment');

require('colors');

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

function dateText(epochTime) {
    return moment(epochTime).calendar();
}

exports.printCheckStatus = function (check, options) {
    return state(check) +
        (options && options.includeCheckDate ? " [" + dateText(check.lastCheck).yellow + "]" : "");
};