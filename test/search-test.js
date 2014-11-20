/* jshint expr:true */
var chai = require('chai'),
    expect = chai.expect,
    vanilliPort = process.env.vanilliPort,
    milli = require('milli').configure({ port: parseInt(vanilliPort) }),
    search = require('../lib/commands/search'),
    MissingArgumentException = require('../lib/exceptions/missing-argument-exception');

describe("search command", function () {
    var config = {
        seyrenUrl: "http://localhost:" + vanilliPort
    };

    beforeEach(function (done) {
        milli.clearStubs(done);
    });

    afterEach(function (done) {
        milli.verifyExpectations(done);
    });

    it("dumps out the the list of matching checks", function (done) {
        var entity = { values: [
            { name: "name1" },
            { name: "name2" }
        ] };

        milli.stub(
            milli.expectRequest(
                milli.onGet('/api/checks')
                    .param("fields", "name")
                    .param("regexes", ".*mytext.*")
                    .respondWith(200)
                    .body(entity)
                    .contentType("application/json")))

            .run(function () {
                search.execute(config, "mytext")
                    .then(function (data) {
                        expect(data).to.equal("name1\nname2");
                    })
                    .done(done, done);
            });
    });

    it("dumps out all checks if no search criteria specified", function (done) {
        var entity = { values: [
            { name: "name1" },
            { name: "name2" }
        ] };

        milli.stub(
            milli.expectRequest(
                milli.onGet('/api/checks')
                    .respondWith(200)
                    .body(entity)
                    .contentType("application/json")))

            .run(function () {
                search.execute(config)
                    .then(function (data) {
                        expect(data).to.equal("name1\nname2");
                    })
                    .done(done, done);
            });
    });

    it("orders matching checks alphabetically", function (done) {
        var entity = { values: [
            { name: "yyy" },
            { name: "azz" },
            { name: "aaa" },
            { name: "zzz" }
        ] };

        milli.stub(
            milli.expectRequest(
                milli.onGet('/api/checks')
                    .param("fields", "name")
                    .param("regexes", ".*mytext.*")
                    .respondWith(200)
                    .body(entity)
                    .contentType("application/json")))

            .run(function () {
                search.execute(config, "mytext")
                    .then(function (data) {
                        expect(data).to.equal("aaa\nazz\nyyy\nzzz");
                    })
                    .done(done, done);
            });
    });
});
