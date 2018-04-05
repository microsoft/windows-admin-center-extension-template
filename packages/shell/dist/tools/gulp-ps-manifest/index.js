'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var gutil = require("gulp-util");
var Path = require("path");
var through2 = require("through2");
var Vinyl = require("vinyl");
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-ps-manifest';
/**
 * Plugin level function
 */
function gulpPsManifest(options) {
    // override options settings if not specified.
    options = Object.assign({
        manifest: 'src/manifest.json',
        removeComments: true
    }, options || {});
    function extendError(pError, error) {
        if (error && (typeof error === 'object')) {
            ['name', 'errno'].forEach(function (property) {
                if (property in error) {
                    // tslint:disable-next-line:no-invalid-this
                    this[property] = error[property];
                }
            }, pError);
        }
        return pError;
    }
    function findCommand(data, result) {
        if (typeof data === 'object') {
            if (data.command) {
                result.push(data);
                return;
            }
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var next = data[key];
                    findCommand(next, result);
                }
            }
        }
    }
    function convert(command, file, content) {
        var commentStart = '<#';
        var commentEnd = '#>';
        var comment = '#';
        var script = '##' + command + '##:' + file + '\n';
        var skipping = false;
        var lines = content.split('\n');
        lines.forEach(function (value, index, array) {
            var text = value.replace('\r', '');
            if (options.removeComments) {
                var process_1 = true;
                text = text.trim();
                if (text.startsWith(commentStart)) {
                    skipping = true;
                }
                if (skipping) {
                    process_1 = false;
                    if (text.endsWith(commentEnd)) {
                        skipping = false;
                    }
                }
                if (process_1 && !text.startsWith(comment) && text.length > 0) {
                    script += text + '\n';
                }
            }
            else {
                script += text + '\n';
            }
        });
        return script;
    }
    var collection = {};
    return through2.obj(function (file, enc, callback) {
        var error = null;
        try {
            if (!options.powerShellModuleName) {
                throw new Error('gulp-ps-manifest requires "powerShellModuleName" option: PowerShell module name.');
            }
            var path = Path.parse(file.path);
            if (path.ext === '.ps1') {
                collection[path.base] = file.contents.toString('utf8');
                ;
            }
        }
        catch (e) {
            error = (!e.plugin || (e.plugin !== PLUGIN_NAME)) ? extendError(new PluginError(PLUGIN_NAME, e.message), e) : e;
        }
        return callback(error);
    }, function (callback) {
        try {
            var manifestObject = JSON.parse(fs.readFileSync(options.manifest, 'utf8'));
            var result = [];
            findCommand(manifestObject.entryPoints, result);
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var item = result_1[_i];
                var name_1 = item.command + '.ps1';
                if (collection[name_1]) {
                    item.script = convert(item.command, name_1, collection[name_1]);
                    item.module = options.powerShellModuleName;
                }
                else {
                    throw new Error('gulp-ps-manifest failed to locate the script: ' + item.command);
                }
            }
            var manifestFile = new Vinyl({
                cwd: './',
                path: options.manifest,
                contents: new Buffer(JSON.stringify(manifestObject, null, 2), 'utf8')
            });
            // tslint:disable-next-line:no-invalid-this
            this.push(manifestFile);
        }
        catch (e) {
            var error = (!e.plugin || (e.plugin !== PLUGIN_NAME)) ? extendError(new PluginError(PLUGIN_NAME, e.message), e) : e;
            gutil.log(error);
        }
        callback();
    });
}
module.exports = gulpPsManifest;
//# sourceMappingURL=index.js.map