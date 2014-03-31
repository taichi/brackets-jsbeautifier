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

    var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    var prefs = PreferencesManager.getExtensionPrefs("beautify");

    exports.on = function(fn) {
        prefs.on("change", fn);
    };

    var PREF_KEY_ENABLED = exports.PREF_KEY_ENABLED = "on_save";
    prefs.definePreference(PREF_KEY_ENABLED, "boolean", false);
    exports.getEnabled = function() {
        return prefs.get(PREF_KEY_ENABLED);
    };
    exports.toggle = function() {
        prefs.set(PREF_KEY_ENABLED, (exports.getEnabled() ^ true) === 1);
        prefs.save();
    };
});
