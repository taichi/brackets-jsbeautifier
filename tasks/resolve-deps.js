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

/*global module, require, process*/
module.exports = function(grunt) {
    "use strict";

    var _ = require("lodash"),
        q = require("q"),
        exec = q.denodeify(require("child_process").exec);

    var run = function(cmd, done, opt) {
        var defaults = {
            maxBuffer: 1024 * 1024
        };
        return exec(cmd, _.merge(defaults, opt)).then(function(stdout) {
            grunt.log.writeln(stdout);
            done();
        }, function(err) {
            grunt.log.writeln(err);
            done(false);
        });
    };

    grunt.registerTask("resolve-node-deps", "resolve server dependencies", function() {
        run("npm install && npm update", this.async(), {
            cwd: "node"
        });
    });

    grunt.registerTask("resolve-thirdparty-deps", "resolve thirdparty dependencies", function() {
        run("git submodule update", this.async());
    });

};
