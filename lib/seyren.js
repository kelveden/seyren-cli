var optimist = require('optimist'),
    MissingArgumentException = require('./exceptions/missing-argument-exception'),
    args = optimist
        .usage('Usage: $0 <command> [<command-args>]')
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
        command = require('./commands/' + commandName + '.js'),
        commandArgs = args._.splice(1),
        config = require('./config.js').loadConfig(args.p);

    commandArgs.unshift(config);

    try {
        command.execute.apply(null, commandArgs)
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

