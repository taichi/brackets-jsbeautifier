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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global $, define, brackets */
define(function(require, exports, module) {
    "use strict";

    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeDomain = brackets.getModule("utils/NodeDomain");

    var dp = ExtensionUtils.getModulePath(module, "node/EditorconfigDomain");
    var domain = new NodeDomain("editorconfig", dp);

    /**
     * @param {string} filepath
     * @param {string} config Specify conf filename other than ".editorconfig"
     * @return {jQuery.Promise}
     */
    return function(filepath, config) {
        return domain.exec("parse", filepath, config);
    };
});
