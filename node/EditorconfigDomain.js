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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global */
(function() {
    "use strict";
    var DOMAIN_NAME = "editorconfig";

    var _ = require("lodash");
    var path = require("path");
    var editorconfig = require("editorconfig");

    var _cmdParse = function(filepath, config, cb) {
        var options = {};
        if (config) {
            options.config = config;
        }
        _.delay(function() {
            filepath = path.normalize(filepath);
            if (path.resolve(filepath) === filepath) {
                cb(null, editorconfig.parse(filepath, options));
            } else {
                cb("filepath must be absolute.");
            }
        });
    };

    exports.init = function(domainManager) {
        if (domainManager.hasDomain(DOMAIN_NAME) === false) {
            domainManager.registerDomain(DOMAIN_NAME, {
                major: 0,
                minor: 1
            });
        }

        domainManager.registerCommand(
            DOMAIN_NAME,
            "parse",
            _cmdParse,
            true,
            "parse .editorconfig", [{
                name: "filepath",
                type: "string",
                description: "path to file"
            }, {
                name: "config",
                type: "string",
                description: 'Specify conf filename other than ".editorconfig"'
            }], [{
                name: "matches",
                type: "object",
                description: "matches configuration"
            }]);
    };
}());
