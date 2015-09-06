'use strict';

var generators = require('yeoman-generator');
var glob = require('glob');
var path = require('path');
var _ = require('lodash');
var s = require('underscore.string');

_.mixin(s.exports());

module.exports = generators.Base.extend({
    constructor: function() {
        generators.NamedBase.apply(this, arguments);

        this.argument('name', {
            type: String,
            required: false
        });
    },

    writing: {
        app: function() {
            var context = {
                appName: this.name || path.basename(process.cwd()),
                _: _
            };
            var templatePathLength = this.templatePath().length + 1;

            glob
                .sync(this.templatePath('**/*'), {nodir: true})
                .map(function(filepath) {
                    return filepath.slice(templatePathLength);
                })
                .forEach((filepath) => {
                    var dirname = path.dirname(filepath);
                    var srcFilename =  path.basename(filepath);
                    var destFilename = srcFilename[0] === '_' ? srcFilename.slice(1) : srcFilename;

                    this.fs.copyTpl(
                        this.templatePath(filepath),
                        this.destinationPath(dirname + '/' + destFilename),
                        context
                    );
                });
        }
    },

    install: {
        npm: function() {
            this.npmInstall();
        }
    },

    end: function() {
        this.spawnCommand('jspm', ['install',  '-y']);
    }
});
