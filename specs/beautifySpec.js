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
/*global define, $, brackets, describe, it, expect, beforeFirst, afterLast, beforeEach, afterEach, runs, waitsFor, waitsForDone, waitsForFail */
/*unittests: Jsbeautifier_beautify */ // for Test Runner of https://github.com/dangoor/TestQuickly
define(function(require, exports, module) {
    "use strict";
    var _ = brackets.getModule("thirdparty/lodash"),
        Async = brackets.getModule("utils/Async"),
        SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils"),
        FileUtils = brackets.getModule("file/FileUtils");

    describe("Jsbeautifier_beautify", function() {
        var extensionPath = FileUtils.getNativeModuleDirectoryPath(module),
            fixtures = extensionPath + "/fixtures/beautify";
        var target, testWindow, PM, DM, CM;

        beforeFirst(function() {
            SpecRunnerUtils.createTestWindowAndRun(this, function(w) {
                testWindow = w;
                // see. src/brackets.js#_initTest
                // https://github.com/adobe/brackets/blob/master/src/brackets.js#L147
                var t = w.brackets.test;
                PM = t.ProjectManager;
                DM = t.DocumentManager;
                CM = t.CommandManager;
                var req = t.ExtensionLoader.getRequireContextForExtension("brackets-jsbeautifier");
                target = req("beautify");
            });
        });

        afterLast(function() {
            SpecRunnerUtils.closeTestWindow();
        });

        describe("beautify", function() {
            var sharedFn = function(extension, msg) {
                var actual = fixtures + "/actual." + extension;
                beforeEach(function() {
                    SpecRunnerUtils.loadProjectInTestWindow(fixtures);
                    SpecRunnerUtils.copy(fixtures + "/original." + extension, actual);
                });

                afterEach(function() {
                    runs(function() {
                        testWindow.closeAllFiles();
                        SpecRunnerUtils.remove(actual);
                    });
                });

                it(msg, function() {
                    runs(function() {
                        var promise = Async.chain([
                            SpecRunnerUtils.makeAbsolute,
                            SpecRunnerUtils.resolveNativeFileSystemPath,
                            FileUtils.readAsText,
                            function(expectText) {
                                var d = $.Deferred();
                                var p = SpecRunnerUtils.openProjectFiles(["actual." + extension]);
                                p.done(function(docs) {
                                    d.resolve({
                                        expectText: expectText,
                                        docs: docs
                                    });
                                }).fail(function(err) {
                                    d.reject(err);
                                });
                                return d.promise();
                            },
                            function(prev) {
                                var d = $.Deferred();
                                var p = target.beautify(prev.docs["actual." + extension]);
                                p.done(function(doc) {
                                    expect(doc.getText()).toBe(prev.expectText);
                                    d.resolve();
                                }).fail(function(err) {
                                    d.reject(err);
                                });
                                return d.promise();
                            }
                        ], ["expect." + extension]);

                        waitsForDone(promise, "wait for spec for " + extension, 10000);
                    });

                });
            };
            describe("js", _.partial(sharedFn, "js", "should format javascript normally"));
            describe("html", _.partial(sharedFn, "html", "should format html normally"));
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
