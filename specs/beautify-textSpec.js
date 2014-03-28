/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, describe, it, expect, beforeFirst, afterLast, beforeEach, afterEach, waitsFor, runs, $, brackets, waitsForDone, waitsForFail */
/*unittests: Jsbeautifier_text */
define(function(require, exports, module) {
    "use strict";

    var _ = brackets.getModule("thirdparty/lodash");

    describe("Jsbeautifier_text", function() {
        var text;
        beforeEach(function() {
            text = require("../beautify-text");
        });

        it("should exporse fn", function() {
            expect(text).not.toBeNull();
            expect(typeof text).toBe("function");
        });

        var makeOptions = _.partial(_.merge, {
            end_of_line: "\n"
        });

        describe("trim_trailing_whitespace", function() {
            it("should remove trailing spaces", function() {
                var opt = makeOptions({
                    trim_trailing_whitespace: true
                });
                var txt = "aaa \nbbb\t\n";
                expect(text(txt, opt)).toBe("aaa\nbbb\n");
            });
        });

        describe("end_of_line", function() {
            it("should replace end of line", function() {
                var opt = makeOptions({
                    trim_trailing_whitespace: false
                });
                var txt = "aaa \rbbb\t\r\n";
                expect(text(txt, opt)).toBe("aaa \nbbb\t\n");
            });
        });

        describe("insert_final_newline", function() {
            it("should append newline", function() {
                var opt = makeOptions({
                    insert_final_newline: true
                });
                var txt = "aaa \nbbb\t";
                expect(text(txt, opt)).toBe("aaa \nbbb\t\n");
            });
        });
    });
});
