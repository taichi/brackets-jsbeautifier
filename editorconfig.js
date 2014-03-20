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
