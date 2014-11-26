/* jshint expr:true */
var chai = require('chai'),
    expect = chai.expect,
    vanilliPort = process.env.vanilliPort,
    milli = require('milli').configure({ port: parseInt(vanilliPort) }),
    check = require('../lib/commands/check'),
    MissingArgumentException = require('../lib/exceptions/missing-argument-exception'),
    Seyren = require('../lib/api');

var dummyCheck = { id: '5464d353e4b026d842a579a2',
        name: 'prod-mixradweb-load',
        description: null,
        target: 'sortByName(aliasByNode(prod.mixradweb.*.info.sys.load.normalized.05_mins_avg,2))',
        from: null,
        until: null,
        enabled: true,
        live: false,
        state: 'OK',
        subscriptions: [
            { id: '5464de8ce4b026d842a579c6',
                target: '591675',
                type: 'HUBOT',
                su: true,
                mo: true,
                tu: true,
                we: true,
                th: true,
                fr: true,
                sa: true,
                ignoreWarn: false,
                ignoreError: false,
                ignoreOk: false,
                enabled: true,
                fromTime: '0000',
                toTime: '2359' }
        ],
        warn: '2.5',
        error: '3.0',
        lastCheck: 1416498005058
    },
    dummyAlerts = { values: [] };

describe("check command", function () {
    var config = {
            seyrenUrl: "http://localhost:" + vanilliPort
        },
        seyren = new Seyren(config);

    beforeEach(function (done) {
        milli.clearStubs(done);
    });

    afterEach(function (done) {
        milli.verifyExpectations(done);
    });

    it("throws an exception if too few arguments", function () {
        expect(function () {
            check.execute(seyren);
        }).to.throw(MissingArgumentException);
    });

    it("pulls seyren check by id if arg is string", function (done) {
        milli.stub(
            milli.expectRequest(
                milli.onGet('/api/checks/myid')
                    .respondWith(200)
                    .body(dummyCheck)
                    .contentType("application/json")),
            milli.expectRequest(
                milli.onGet('/api/checks/myid/alerts')
                    .respondWith(200)
                    .body(dummyAlerts)
                    .contentType("application/json")
            )
        )
            .run(function () {
                check.execute(seyren, "myid")
                    .done(function () {
                        done();
                    }, done);
            });
    });
});