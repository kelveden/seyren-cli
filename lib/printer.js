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

exports.printCheckStatus = function (check) {
    return state(check);
};

exports.printDateText = function (epochTime) {
    if (epochTime > 0) {
        return "[" + moment(epochTime).calendar().yellow + "]";
    } else {
        return "Never".yellow;
    }
};