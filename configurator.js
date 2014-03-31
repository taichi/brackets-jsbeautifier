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
/*global define, $, brackets, window, JSON5 */
define(function(require, exports, module) {
    "use strict";

    require("thirdparty/json5/lib/json5");

    var _ = brackets.getModule("thirdparty/lodash"),
        AppInit = brackets.getModule("utils/AppInit"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        FileUtils = brackets.getModule("file/FileUtils"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    var editorconfig = require("editorconfig");

    var defaults = JSON5.parse(require("text!thirdparty/js-beautify/js/config/defaults.json"));
    var currentConfig = defaults;

    var RC = ".jsbeautifyrc";

    var getProjectRc = function() {
        var root = ProjectManager.getProjectRoot();
        if (root) {
            return root.fullPath + RC;
        }
        return "";
    };

    var loadRc = function(path) {
        var defr = $.Deferred();

        if (!path) {
            return defr.reject(new Error("Missing Project Root")).promise();
        }
        var file = FileSystem.getFileForPath(path);
        if (!file) {
            return defr.reject(new Error("Missing file for " + path)).promise();
        }
        FileUtils.readAsText(file).done(function(data) {
            try {
                defr.resolve(JSON5.parse(data));
            } catch (err) {
                defr.reject(err);
            }
        }).fail(function(err) {
            defr.reject(err);
        });

        return defr.promise();

    };

    var loadConfig = function() {
        var fn = function(data) {
            currentConfig = _.merge(defaults, data);
        };
        loadRc(getProjectRc())
            .done(fn)
            .fail(function() {
                var userRc = brackets.app.getApplicationSupportDirectory() + "/" + RC;
                loadRc(userRc)
                    .done(fn)
                    .fail(function() {
                        currentConfig = defaults;
                    });
            });
    };

    var endsWith = function(str, ends) {
        if (ends === "") return true;
        if (!str || !ends) return false;
        return ends.length <= str.length && str.slice(str.length - ends.length) === ends;
    };

    AppInit.appReady(function() {
        $(DocumentManager).on("documentSaved.beautify documentRefreshed.beautify", function(event, doc) {
            if (endsWith(doc.file.fullPath, RC)) {
                loadConfig();
            }
        });

        $(ProjectManager).on("projectOpen.beautify", loadConfig);

        loadConfig();
    });

    /**
     * .editorconfig to .jsbeautifyrc translation.
     */
    var translate = function(edconf) {
        var result = {};
        if (edconf.indent_style) {
            if (edconf.indent_style === 'tab') {
                result.indent_char = '\t';
                result.indent_with_tabs = true;
            }
            if (edconf.indent_style === 'space') {
                result.indent_char = ' ';
            }
            delete edconf.indent_style;
        }
        if (edconf.end_of_line) {
            var eol = edconf.end_of_line;
            if (eol === 'cr') {
                result.end_of_line = '\r';
            } else if (eol === 'lf') {
                result.end_of_line = '\n';
            } else if (eol === 'crlf') {
                result.end_of_line = '\r\n';
            }
            delete edconf.end_of_line;
        }
        return _.merge(result, edconf);
    };

    // exports for testing.
    exports._endsWith = endsWith;
    exports._translate = translate;

    /**
     * @param {string} absolute filepath
     * @return {jQuery.Promise}
     */
    exports.configure = function(filepath) {
        var defr = $.Deferred();
        editorconfig(filepath).done(function(data) {
            defr.resolve(_.merge(currentConfig, translate(data)));
        }).fail(function(err) {
            defr.reject(err);
        });
        return defr.promise();
    };
});
