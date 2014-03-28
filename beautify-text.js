/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function(require, exports, module) {
    "use strict";

    var eol = function(options) {
        if (options.end_of_line) {
            return options.end_of_line;
        }
        if (brackets.platform === "win") {
            return "\r\n";
        }
        return "\n";
    };

    return function(txt, options) {
        var result = txt;
        if (options.trim_trailing_whitespace) {
            result = result.replace(/[ \f\t\v\u00A0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u2028\u2029\u202f\u205f\u3000]+(\r\n|\r|\n)/g, eol(options));
        } else if (options.end_of_line) {
            result = result.replace(/\r\n|\r|\n/g, options.end_of_line);
        }
        if (options.insert_final_newline) {
            var ln = eol(options);
            var lnln = ln + ln;
            if (txt.substring(txt.length - lnln.length) !== lnln) {
                result += ln;
            }
        }
        return result;
    };
});
