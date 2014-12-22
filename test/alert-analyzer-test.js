/* jshint expr:true */
var chai = require('chai'),
    expect = chai.expect,
    analyzer = require('../lib/alert-analyzer');

function alert(from, to, timestamp) {
    return {
        fromType: from,
        toType: to,
        timestamp: timestamp
    };
}

function samplePeriod(config) {
    return config;
}

describe("alert analyzer", function () {
    describe("getSpans", function () {
        it("gets single span entirely within sample period", function () {
            var spans = analyzer.getSpans([
                { fromType: "OK", toType: "WARN", timestamp: 1000 },
                { fromType: "WARN", toType: "OK", timestamp: 3000 }
            ]);

            expect(spans).to.deep.equal([
                { start: 1000, end: 3000, type: "WARN" }
            ]);
        });

        it("gets multiple spans entirely within sample period", function () {
            var spans = analyzer.getSpans([
                { fromType: "OK", toType: "WARN", timestamp: 1000 },
                { fromType: "WARN", toType: "OK", timestamp: 3000 },
                { fromType: "OK", toType: "WARN", timestamp: 5000 },
                { fromType: "WARN", toType: "OK", timestamp: 8000 }
            ]);

            expect(spans).to.deep.equal([
                { start: 1000, end: 3000, type: "WARN" },
                { start: 5000, end: 8000, type: "WARN" }
            ]);
        });

        it("ignores alerts transitioning between the same type", function () {
            var spans = analyzer.getSpans([
                { fromType: "OK", toType: "WARN", timestamp: 1000 },
                { fromType: "WARN", toType: "WARN", timestamp: 2000 },
                { fromType: "WARN", toType: "OK", timestamp: 3000 }
            ]);

            expect(spans).to.deep.equal([
                { start: 1000, end: 3000, type: "WARN" }
            ]);
        });
    });

    describe("calculationDurationsOf", function () {
        it("gives duration of span entirely within sample period = end - start", function () {
            var spans = analyzer.calculateDurationsOf([
                { start: 1000, end: 3000 },
                { start: 5000, end: 8000 }
            ], samplePeriod({ start: 0, end: 1000000 }));

            expect(spans).to.deep.equal([
                { start: 1000, end: 3000, duration: 2000 },
                { start: 5000, end: 8000, duration: 3000 }
            ]);
        });

        it("gives duration of span overlapping start of sample period = end - start of sample period", function () {
            var spans = analyzer.calculateDurationsOf([
                { start: 1000, end: 3000 }
            ], samplePeriod({ start: 2000, end: 1000000 }));

            expect(spans).to.deep.equal([
                { start: 1000, end: 3000, duration: 1000 }
            ]);
        });

        it("gives duration of span without start = end - start of sample period", function () {
            var spans = analyzer.calculateDurationsOf([
                { end: 3000 }
            ], samplePeriod({ start: 2000, end: 1000000 }));

            expect(spans).to.deep.equal([
                { end: 3000, duration: 1000 }
            ]);
        });

        it("gives duration of span overlapping end of sample period = end of sample period - start", function () {
            var spans = analyzer.calculateDurationsOf([
                { start: 1000, end: 3000 }
            ], samplePeriod({ start: 0, end: 2000 }));

            expect(spans).to.deep.equal([
                { start: 1000, end: 3000, duration: 1000 }
            ]);
        });

        it("gives duration of span without end = end of sample period - start", function () {
            var spans = analyzer.calculateDurationsOf([
                { start: 1000 }
            ], samplePeriod({ start: 0, end: 2000 }));

            expect(spans).to.deep.equal([
                { start: 1000, duration: 1000 }
            ]);
        });

        it("gives duration of span overlapping end AND start of sample period = end of sample period - start of sample period", function () {
            var spans = analyzer.calculateDurationsOf([
                { start: 1000, end: 5000 }
            ], samplePeriod({ start: 2000, end: 4000 }));

            expect(spans).to.deep.equal([
                { start: 1000, end: 5000, duration: 2000 }
            ]);
        });

        it("gives duration of span outside sample period = 0", function () {
            var spans = analyzer.calculateDurationsOf([
                { start: 100000, end: 200000 }
            ], samplePeriod({ start: 0, end: 1000 }));

            expect(spans).to.deep.equal([
                { start: 100000, end: 200000, duration: 0 }
            ]);
        });
    });

    describe("calculateTotalDurationOf", function () {
        it("adds up all durations of spans", function () {
            var total = analyzer.calculateTotalDurationOf([
                { duration: 2000 },
                { duration: 3000 },
                { duration: 200 }
            ]);

            expect(total).to.equal(5200);
        });

        it("results in 0 if no spans", function () {
            var total = analyzer.calculateTotalDurationOf([]);

            expect(total).to.equal(0);
        });
    });
});