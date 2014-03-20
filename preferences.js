/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function(require, exports, module) {
    "use strict";

    var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    var prefs = PreferencesManager.getExtensionPrefs("beautify");

    exports.on = function(fn) {
        prefs.on("change", fn);
    };

    var PREF_KEY_ENABLED = "on_save";
    prefs.definePreference(PREF_KEY_ENABLED, "boolean", false);
    exports.getEnabled = function() {
        return prefs.get(PREF_KEY_ENABLED);
    };
    exports.toggle = function() {
        prefs.set(PREF_KEY_ENABLED, (exports.getEnabled() ^ true) === 1);
        prefs.save();
    };
});
