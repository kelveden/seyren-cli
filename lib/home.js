var fs = require('fs'),
    path = require('path'),
    homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    seyrenDir = path.join(homeDir, ".seyren");

exports.loadConfig = function () {
    return JSON.parse(fs.readFileSync(path.join(seyrenDir, "config.json"), "utf8"));
};

exports.saveLastSearch = function (content) {
    fs.writeFileSync(path.join(seyrenDir, "last-search.json"), JSON.stringify(content), "utf8");
};

exports.loadLastSearch = function () {
    return JSON.parse(fs.readFileSync(path.join(seyrenDir, "last-search.json"), "utf8"));
};