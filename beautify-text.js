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
