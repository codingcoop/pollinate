/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)
   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var async = require('async');
var fs = require('fs');
var path = require('path');
var cwd = process.cwd();

module.exports = function (state, callback) {
    var link = state.data.link;

    if (link === undefined) {
        callback(null, state);
        return;
    }

    process.chdir(state.template.tmp);

    async.parallel(
        link.map(
            function (item) {
                var symlinkPath = item[Object.keys(item)[0]],
                    relativeTarget = path.relative(Object.keys(item)[0], symlinkPath);

                return function (done) {
                    fs.symlink(
                        relativeTarget,
                        symlinkPath,
                        function (err) {
                            if (err) {
                                done(err);
                                return;
                            }
                            done(null);
                        }
                    );
                };
            }
        ),
        function (err) {
            process.chdir(cwd);
            if (err) {
                callback(err);
                return;
            }
            callback(null, state);
        }
    );
};
