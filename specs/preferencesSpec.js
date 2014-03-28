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
