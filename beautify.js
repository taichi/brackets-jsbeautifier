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

    var _ = brackets.getModule("thirdparty/lodash"),
        EditorManager = brackets.getModule("editor/EditorManager");

    var js = require("thirdparty/js-beautify/js/lib/beautify"),
        css = require("thirdparty/js-beautify/js/lib/beautify-css"),
        html = require("thirdparty/js-beautify/js/lib/beautify-html").html_beautify,
        text = require("beautify-text");

    var conf = require("configurator");

    var types = {};
    var mapping = function(fn /*, types...*/ ) {
        var cfn = function(txt, options) {
            return text(fn(txt, options), options);
        };
        var args = Array.prototype.slice.call(arguments);
        _.rest(args).forEach(function(v) {
            types[v] = cfn;
        });
    };

    mapping(js, "javascript", "json");
    mapping(html, "html", "php", "xml", "ejs", "jsp", "jinja2");
    mapping(css, "css", "less", "scss");

    var select = function(docid) {
        var fn = types[docid];
        if (fn) {
            return fn;
        }
        return text;
    };

    // exports for testing.
    exports._select = select;

    exports.beautify = function(targetDoc) {
        var defr = $.Deferred();
        conf.configure(targetDoc.file.fullPath)
            .done(function(options) {
                var editor = EditorManager.getCurrentFullEditor();
                var cursor = editor.getCursorPos();
                var scroll = editor.getScrollPos();

                var formatter = select(targetDoc.getLanguage().getId());
                var text = formatter(targetDoc.getText(), options);
                targetDoc.setText(text);

                editor.setCursorPos(cursor);
                editor.setScrollPos(scroll.x, scroll.y);

                defr.resolve(targetDoc);
            })
            .fail(function(err) {
                defr.reject(err);
            });
        return defr.promise();
    };
});
