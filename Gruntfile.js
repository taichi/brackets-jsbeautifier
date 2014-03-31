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

/*global module, require*/
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('tasks');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            options: {
                force: true
            },
            src: ["dist/"]
        },
        jshint: {
            all: [
                "*.js",
                "node/*.js",
                "specs/*.js"
            ]
        },
        compress: {
            main: {
                options: {
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"
                },
                files: [{
                    src: [
                        "*.js",
                        "!Gruntfile.js",
                        "!unittests.js",
                        "nls/**/*.js",
                        "node/**",
                        "!node/**/test*/*.js",
                        "thirdparty/**/*.js",
                        "!thirdparty/**/test*/**",
                        "!thirdparty/js-beautify/web/**"
                    ]
                }, {
                    src: [
                        "*.json",
                        "thirdparty/js-beautify/js/config/*.json"
                    ]
                }]
            }
        }
    });

    grunt.registerTask("resolve-deps", ["resolve-node-deps", "resolve-thirdparty-deps"]);
    grunt.registerTask("build", ["clean", "jshint", "resolve-deps", "compress"]);

    grunt.registerTask('default', ['build']);
};
