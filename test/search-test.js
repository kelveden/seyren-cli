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

    it("throws an exception if too few arguments", function () {
        expect(function () {
            search.execute(config);
        }).to.throw(MissingArgumentException);
    });

    it("dumps out the the list of matching alert names", function (done) {
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
});
