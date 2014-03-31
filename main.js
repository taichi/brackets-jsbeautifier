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


    var CMD_PREFIX = "taichi.jsbeautifier.";
    var CMD_FORMAT = exports.CMD_FORMAT = CMD_PREFIX + "beautify";
    var CMD_FORMAT_ON_SAVE = exports.CMD_FORMAT_ON_SAVE = CMD_PREFIX + "on_save";

    var _ = brackets.getModule("thirdparty/lodash"),
        AppInit = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Commands = brackets.getModule('command/Commands'),
        Menus = brackets.getModule("command/Menus"),
        DocumentManager = brackets.getModule("document/DocumentManager");

    var strings = require("i18n!nls/strings");

    var beautify = require("beautify").beautify,
        prefs = require("preferences"),
        guard = require("guard")();

    var EVENT_SAVED = exports.EVENT_SAVED = "documentSaved.beautify";
    var activate = function() {
        $(DocumentManager).on(EVENT_SAVED, onSave);
    };
    var deactivate = function() {
        $(DocumentManager).off(EVENT_SAVED);
    };

    var onSave = function(event, doc) {
        guard.order(event.timeStamp, function() {
            deactivate();
            beautify(doc).done(function(d) {
                CommandManager.execute(Commands.FILE_SAVE, {
                    doc: d
                }).always(_.partial(_.delay, activate, 1000));
            });
        });
    };

    var onChange = function(event) {
        var enabled = prefs.getEnabled();
        if (enabled) {
            activate();
            guard.reset();
        } else {
            deactivate();
        }
        var formatOnSave = CommandManager.get(CMD_FORMAT_ON_SAVE);
        if (formatOnSave) {
            formatOnSave.setChecked(enabled);
        }
    };
    AppInit.appReady(onChange);

    prefs.on(onChange);

    CommandManager.register(strings.CMD_FORMAT, CMD_FORMAT, _.compose(beautify, DocumentManager.getCurrentDocument));
    CommandManager.register(strings.CMD_FORMAT_ON_SAVE, CMD_FORMAT_ON_SAVE, prefs.toggle);

    var command = [{
        key: "Ctrl-Shift-B",
        platform: "win"
    }, {
        key: "Cmd-Shift-B",
        platform: "mac"
    }];

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(CMD_FORMAT, command);
    menu.addMenuItem(CMD_FORMAT_ON_SAVE);
});
