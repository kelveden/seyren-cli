/* jshint expr:true */
var chai = require('chai'),
    expect = chai.expect,
    vanilliPort = process.env.vanilliPort,
    milli = require('milli').configure({ port: parseInt(vanilliPort) }),
    search = require('../lib/commands/search'),
    Seyren = require('../lib/api');

require('colors');

describe("search command", function () {
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

    function checkDescription(number, name, id) {
        return "[" + number.toString().cyan + "] [" + id.yellow + "] " + name;
    }

    it("dumps out the the list of matching checks", function (done) {
        var entity = { values: [
            { name: "name1", id: "1" },
            { name: "name2", id: "2" }
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
                search.execute(seyren, "mytext")
                    .then(function (data) {
                        expect(data).to.equal([
                            checkDescription(1, "name1", "1"),
                            checkDescription(2, "name2", "2")
                        ].join("\n"));
                    })
                    .done(done, done);
            });
    });

    it("dumps out all checks if no search criteria specified", function (done) {
        var entity = { values: [
            { name: "name1", id: "1" },
            { name: "name2", id: "2" }
        ] };

        milli.stub(
            milli.expectRequest(
                milli.onGet('/api/checks')
                    .respondWith(200)
                    .body(entity)
                    .contentType("application/json")))

            .run(function () {
                search.execute(seyren)
                    .then(function (data) {
                        expect(data).to.equal([
                            checkDescription(1, "name1", "1"),
                            checkDescription(2, "name2", "2")
                        ].join("\n"));
                    })
                    .done(done, done);
            });
    });

    it("orders matching checks alphabetically", function (done) {
        var entity = { values: [
            { name: "yyy", id: "A" },
            { name: "azz", id: "B" },
            { name: "aaa", id: "C" },
            { name: "zzz", id: "D" }
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
                search.execute(seyren, "mytext")
                    .then(function (data) {
                        expect(data).to.equal([
                            checkDescription(1, "aaa", "C"),
                            checkDescription(2, "azz", "B"),
                            checkDescription(3, "yyy", "A"),
                            checkDescription(4, "zzz", "D")
                        ].join("\n"));
                    })
                    .done(done, done);
            });
    });
});
