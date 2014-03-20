/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function(require, exports, module) {
    "use strict";

    var timestamp = Date.now();
    return {
        order: function(d, fn) {
            var diff = d - timestamp;
            if (1000 < diff) {
                timestamp = d;
                fn();
            }
        },
        reset: function() {
            timestamp = Date.now();
        }
    };
});
