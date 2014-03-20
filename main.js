/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function(require, exports, module) {
    "use strict";

    var CMD_PREFIX = "taichi.jsbeautifier.";
    var CMD_FORMAT = CMD_PREFIX + "beautify";
    var CMD_FORMAT_ON_SAVE = CMD_PREFIX + "on_save";

    var _ = brackets.getModule("thirdparty/lodash"),
        AppInit = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Commands = brackets.getModule('command/Commands'),
        Menus = brackets.getModule("command/Menus"),
        DocumentManager = brackets.getModule("document/DocumentManager");

    var strings = require("i18n!nls/strings");

    var beautify = require("beautify"),
        prefs = require("preferences"),
        guard = require("guard");

    var EVENT_SAVED = "documentSaved.beautify";
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
        formatOnSave.setChecked(enabled);
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
