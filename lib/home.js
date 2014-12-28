var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    seyrenDir = path.join(homeDir, ".seyren"),
    lastSearchFile = path.join(seyrenDir, "last-search.json"),
    favouritesFile = path.join(seyrenDir, "favourites.json");

exports.loadConfig = function () {
    return JSON.parse(fs.readFileSync(path.join(seyrenDir, "config.json"), "utf8"));
};

exports.saveLastSearch = function (content) {
    fs.writeFileSync(lastSearchFile, JSON.stringify(content), "utf8");
};

exports.loadLastSearch = function () {
    return JSON.parse(fs.readFileSync(lastSearchFile, "utf8"));
};

exports.loadFavourites = function () {
    if (fs.existsSync(favouritesFile)) {
        return JSON.parse(fs.readFileSync(favouritesFile, "utf8"));
    } else {
        return [];
    }
};

exports.favourite = function (checkId) {
    var favourites = exports.loadFavourites();

    favourites.push(checkId);
    favourites = _.uniq(favourites);

    fs.writeFileSync(favouritesFile, JSON.stringify(favourites), "utf8");
};

exports.unfavourite = function (checkId) {
    var favourites = exports.loadFavourites();

    favourites = _.without(favourites, checkId);

    fs.writeFileSync(favouritesFile, JSON.stringify(favourites), "utf8");
};