/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global */
(function() {
    "use strict";
    var DOMAIN_NAME = "editorconfig";

    var _ = require("lodash");
    var editorconfig = require("editorconfig");

    var _cmdParse = function(filepath, config, cb) {
        var options = {};
        if (config) {
            options.config = config;
        }
        _.delay(function() {
            cb(null, editorconfig.parse(filepath, options));
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
