exports.loadConfig = function () {
    var fs = require('fs'),
        homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

    return JSON.parse(fs.readFileSync(homeDir + "/.seyren/config.json", "utf8"));
};
