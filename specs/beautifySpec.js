/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, describe, it, expect, beforeFirst, afterLast, beforeEach, afterEach, runs, waitsFor, waitsForDone, waitsForFail */
/*unittests: Jsbeautifier_beautify */ // for Test Runner of https://github.com/dangoor/TestQuickly
define(function(require, exports, module) {
    "use strict";
    var _ = brackets.getModule("thirdparty/lodash"),
        SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils"),
        FileUtils = brackets.getModule("file/FileUtils");

    var expectText = require("text!specs/fixtures/beautify/expect.js");

    describe("Jsbeautifier_beautify", function() {
        var extensionPath = FileUtils.getNativeModuleDirectoryPath(module),
            fixtures = extensionPath + "/fixtures/beautify";
        var target, PM, DM;

        beforeFirst(function() {
            SpecRunnerUtils.createTestWindowAndRun(this, function(w) {
                // see. src/brackets.js#_initTest
                // https://github.com/adobe/brackets/blob/master/src/brackets.js#L147
                var t = w.brackets.test;
                PM = t.ProjectManager;
                DM = t.DocumentManager;
                var req = t.ExtensionLoader.getRequireContextForExtension("brackets-jsbeautifier");
                target = req("beautify");
            });
        });

        afterLast(function() {
            SpecRunnerUtils.closeTestWindow();
        });

        describe("beautify", function() {
            var actual = fixtures + "/actual.js";
            beforeEach(function() {
                SpecRunnerUtils.loadProjectInTestWindow(fixtures);
                SpecRunnerUtils.copy(fixtures + "/original.js", actual);
            });

            afterEach(function() {
                SpecRunnerUtils.remove(actual);
            });

            it("should work normally", function() {
                runs(function() {
                    var promise = SpecRunnerUtils.openProjectFiles(["actual.js"]).done(function(docs) {
                        var p = target.beautify(docs["actual.js"]).done(function(doc) {
                            expect(doc.getText()).toBe(expectText);
                        });
                        waitsForDone(p, "beautify test file", 10000);
                    });
                    waitsForDone(promise, "open test file");
                });
            });
        });

        describe("select", function() {
            it("should select valid function", function() {
                var fn = target._select("javascript");
                expect(fn).not.toBeNull();
                expect(typeof fn).toBe("function");
            });
        });

    });
});