seyren-cli
==========
[![Build Status](https://travis-ci.org/kelveden/seyren-cli.png?branch=master)](https://travis-ci.org/kelveden/seyren-cli)

A CLI for [seyren](https://github.com/scobal/seyren).

Installing
----------
Firstly, ensure that [nodejs](http://nodejs.org/) is installed. You'll typically find this
available in your OS package manager.

Once installed, you can install seyren-cli itself:

```
npm install -g seyren-cli
```

(You may need to run this under `sudo`.)

### Configuration
You will need a very simple configuration file setup in `~/.seyren/config.json`. The contents are:

```
{
    seyrenUrl: "http://your_seyren_host"
}
```

Now you're good to go.

Running
-------
To see a list of available commands just run:

```
seyren
```

### Examples
 * Display a list of all checks:

```
seyren search
```

 * Display a list of all checks containing "mytext" in their name

```
seyren search mytext
```

 * Display the details of the check with id "mycheckid"

```
seyren check mycheckid
```

 * Display the raw JSON of the check with id "mycheckid"

```
seyren check mycheckid --raw
```

 * Display the details of the 5th check from the last search

```
seyren check 5
```

 * Open the 3rd check from the last search in a browser

```
seyren open 3
```

Contributing
------------
Rather than installing from npm you're better off running from the source code itself. Firstly, make sure you've uninstalled seyren-cli (`npm uninstall seyren-cli`) then clone the repo and then:

```
npm link
```

This will create a symlink from the source seyren executable to the global node_modules folder.

The build tool is gulp. So, make sure that `./node_modules/.bin` is on your path and then run `gulp`. (You could install gulp globally of course but then you're not guaranteed to be using the version of gulp that's used in the travis CI build.) 
