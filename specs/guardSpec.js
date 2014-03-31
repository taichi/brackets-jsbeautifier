//   Copyright 2014 SATO taichi <ryushi@gmail.com>
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

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
