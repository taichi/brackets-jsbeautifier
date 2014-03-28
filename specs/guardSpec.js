/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, describe, it, expect, beforeFirst, afterLast, beforeEach, afterEach, waitsFor, runs, $, brackets, waitsForDone, waitsForFail */
/*unittests: Jsbeautifier_guard */
define(function(require, exports, module) {
    "use strict";

    describe("Jsbeautifier_guard", function() {
        var guard;
        beforeEach(function() {
            guard = require("../guard");
        });

        it("should exporse fn", function() {
            expect(guard).not.toBeNull();
            expect(typeof guard).toBe("function");
        });

        it("should run", function() {
            var g = guard(function() {
                return 0;
            });
            var fn = function() {
                fn.called = true;
            };
            g.order(1001, fn);
            expect(fn.called).toBe(true);
        });

        it("should reset", function() {
            var times = 0;
            var g = guard(function() {
                times++;
                return 0;
            });
            g.reset();
            expect(times).toBe(2);
        });
    });
});
