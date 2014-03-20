/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function(require, exports, module) {
    "use strict";

    var _ = brackets.getModule("thirdparty/lodash"),
        EditorManager = brackets.getModule("editor/EditorManager");

    var js = require("thirdparty/js-beautify/js/lib/beautify"),
        css = require("thirdparty/js-beautify/js/lib/beautify-css"),
        html = require("thirdparty/js-beautify/js/lib/beautify-html");

    var conf = require("configurator");

    var eol = function(options) {
        if (options.end_of_line) {
            return options.end_of_line;
        }
        if (brackets.platform === "win") {
            return "\r\n";
        }
        return "\n";
    };

    var text = function(txt, options) {
        var result = txt;
        if (options.trim_trailing_whitespace) {
            result = result.replace(/[ \f\t\v\u00A0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u2028\u2029\u202f\u205f\u3000]+(\r\n|\r|\n)/g, eol(options));
        } else if (options.end_of_line) {
            result = result.replace(/\r\n|\r|\n/g, options.end_of_line);
        }
        if (options.insert_final_newline) {
            if (/\r\n|\r|\n/m.test(txt.substring(txt.length - 2)) === false) {
                result += eol(options);
            }
        }
        return result;
    };
    var compose = function(fn) {
        return function(txt, options) {
            return text(fn(txt, options), options);
        };
    };

    var mapping = function(fn /*, types...*/ ) {
        var args = Array.prototype.slice.call(arguments);
        _.rest(args).forEach(function(v) {
            mapping.types[v] = fn;
        });
    };
    mapping.types = {};
    mapping(compose(js), "javascript", "json");
    mapping(compose(html), "html", "php", "xml", "ejs", "jsp", "jinja2");
    mapping(compose(css), "css", "less", "scss");

    var select = function(doc) {
        var fn = mapping.types[doc.getLanguage().getId()];
        if (fn) {
            return fn;
        }
        return text;
    };

    return function(targetDoc) {
        var defr = $.Deferred();
        conf.configure(targetDoc.file.fullPath)
            .done(function(options) {
                var editor = EditorManager.getCurrentFullEditor();
                var cursor = editor.getCursorPos();
                var scroll = editor.getScrollPos();

                var formatter = select(targetDoc);
                var text = formatter(targetDoc.getText(), options);
                targetDoc.setText(text);

                editor.setCursorPos(cursor);
                editor.setScrollPos(scroll.x, scroll.y);

                defr.resolve(targetDoc);
            })
            .fail(function(err) {
                console.error(err);
                defr.reject(err);
            });
        return defr.promise();
    };
});
