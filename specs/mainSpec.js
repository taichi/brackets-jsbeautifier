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
