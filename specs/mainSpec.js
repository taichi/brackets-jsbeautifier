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
/*unittests: Jsbeautifier */
define(function(require, exports, module) {
    "use strict";

    var SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils");

    describe("Jsbeautifier", function() {
        var Menus, main;

        beforeFirst(function() {
            SpecRunnerUtils.createTestWindowAndRun(this, function(w) {
                var t = w.brackets.test;
                Menus = t.Menus;
                var req = t.ExtensionLoader.getRequireContextForExtension("brackets-jsbeautifier");
                main = req("main");
            });
        });

        afterLast(function() {
            Menus = null;
            SpecRunnerUtils.closeTestWindow();
        });

        it("should expose a Menus", function() {
            expect(Menus.getMenuItem(main.CMD_FORMAT)).not.toBeNull();
            expect(Menus.getMenuItem(main.CMD_FORMAT_ON_SAVE)).not.toBeNull();
        });
    });
});
