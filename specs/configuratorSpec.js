/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, describe, it, expect, beforeFirst, afterLast, beforeEach, afterEach, runs, $, brackets, waitsForDone, waitsForFail */
/*unittests: Jsbeautifier_configurator */
define(function(require, exports, module) {
    "use strict";

    var SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils"),
        FileUtils = brackets.getModule("file/FileUtils");

    describe("Jsbeautifier_configurator", function() {
        var extensionPath = FileUtils.getNativeModuleDirectoryPath(module),
            fixtures = extensionPath + "/fixtures/configurator";
        var target, PM;

        beforeFirst(function() {
            SpecRunnerUtils.createTestWindowAndRun(this, function(w) {
                var t = w.brackets.test;
                PM = t.ProjectManager;
                var req = t.ExtensionLoader.getRequireContextForExtension("brackets-jsbeautifier");
                target = req("configurator");
            });
        });

        afterLast(function() {
            SpecRunnerUtils.closeTestWindow();
        });

        describe("configure", function() {
            beforeEach(function() {
                SpecRunnerUtils.loadProjectInTestWindow(fixtures);
            });

            it("should work normally", function() {
                var self = this;
                runs(function() {
                    var promise = target.configure(fixtures + "/test.js").done(function(options) {
                        expect(options.end_of_line).toBe("\n");
                    });
                    waitsForDone(promise, "configure", 10000);
                });
            });

            it("should fail", function() {
                var self = this;
                runs(function() {
                    var promise = target.configure("test2.js").done(function(options) {
                        self.fail("not happen to error");
                    });
                    waitsForFail(promise, "configure", 10000);
                });
            });
        });

        describe("endsWith", function() {
            it("should return true", function() {
                expect(target._endsWith("", "")).toBe(true);
                expect(target._endsWith("foobar.txt", ".txt")).toBe(true);
            });
            it("should return false", function() {
                expect(target._endsWith("a", "aa")).toBe(false);
                expect(target._endsWith("zz.t", ".c")).toBe(false);
            });
        });

        describe("translate", function() {
            describe("indent_style", function() {
                it("translates tab", function() {
                    var r = target._translate({
                        indent_style: "tab"
                    });
                    expect(r).toEqual({
                        indent_char: "\t",
                        indent_with_tabs: true
                    });
                });

                it("translates spaces", function() {
                    var r = target._translate({
                        indent_style: "space"
                    });
                    expect(r).toEqual({
                        indent_char: " "
                    });
                });
            });

            describe("end_of_line", function() {
                it("translates cr", function() {
                    var r = target._translate({
                        end_of_line: 'cr'
                    });
                    expect(r).toEqual({
                        end_of_line: "\r"
                    });
                });
                it("translates lf", function() {
                    var r = target._translate({
                        end_of_line: 'lf'
                    });
                    expect(r).toEqual({
                        end_of_line: "\n"
                    });
                });
                it("translates crlf", function() {
                    var r = target._translate({
                        end_of_line: 'crlf'
                    });
                    expect(r).toEqual({
                        end_of_line: "\r\n"
                    });
                });
            });

            describe("passthrough", function() {
                it("should passthrough", function() {
                    var input = {
                        aaa: 1,
                        bbb: 2
                    };
                    expect(target._translate(input)).toEqual(input);
                });
            });
        });

    });
});
