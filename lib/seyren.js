var optimist = require('optimist'),
    MissingArgumentException = require('./exceptions/missing-argument-exception'),
    moment = require('moment'),
    args = optimist
        .usage('Usage: $0 <command> [<command-args>]')
        .describe("raw", "Display raw JSON output")
        .argv;

function printCommands(done) {
    var fs = require("fs"),
        path = require("path");

    console.log("Commands:");

    fs.readdir(__dirname + "/commands", function (err, files) {
        if (err) {
            throw err;
        }

        files.forEach(function (file) {
            console.log("  " + require('./commands/' + file).usage());
        });

        done();
    });
}

if ((args._.length === 0) || args.help) {
    optimist.showHelp();
    printCommands(process.exit);

} else {

    var commandName = args._[0],
        command = require('./commands/' + commandName),
        commandArgs = args._.splice(1),
        config = require('./home').loadConfig(args.p),
        rawOutput = args.raw;

    moment.locale(config.locale || "en-GB");
    commandArgs.unshift(config);

    try {
        command.execute.apply(null, commandArgs)
            .then(function (data) {
                if (rawOutput) {
                    return data;
                } else {
                    return command.format.apply(null, [ data ]);
                }
            })
            .done(console.log, console.error);
    } catch (e) {
        if (e instanceof MissingArgumentException) {
            console.log("Usage: " + command.usage());
            process.exit(1);
        } else {
            throw e;
        }
    }
}

