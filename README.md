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