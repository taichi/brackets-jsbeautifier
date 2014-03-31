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
/*unittests: Jsbeautifier_preferences */
define(function(require, exports, module) {
    "use strict";

    var SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils");

    describe("Jsbeautifier_preferences", function() {
        var PM, target, KEY;

        beforeFirst(function() {
            SpecRunnerUtils.createTestWindowAndRun(this, function(w) {
                var t = w.brackets.test;
                PM = t.PreferencesManager;
                var req = t.ExtensionLoader.getRequireContextForExtension("brackets-jsbeautifier");
                target = req("preferences");
                KEY = "beautify." + target.PREF_KEY_ENABLED;
            });
        });

        afterLast(function() {
            PM = null;
            SpecRunnerUtils.closeTestWindow();
        });

        it("should receive on", function() {
            var times = 0;
            target.on(function() {
                times++;
            });
            PM.set(KEY, true);
            expect(times).toBe(1);
        });

        it("should current state", function() {
            PM.set(KEY, true);
            expect(target.getEnabled()).toBe(true);
        });

        it("should toggle", function() {
            PM.set(KEY, false);
            target.toggle();
            expect(PM.get(KEY)).toBe(true);
            target.toggle();
            expect(PM.get(KEY)).toBe(false);
            PM.set(KEY, true);
        });
    });
});
