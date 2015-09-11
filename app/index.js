'use strict';

var generators = require('yeoman-generator');
var glob = require('glob');
var path = require('path');
var _ = require('lodash');
var s = require('underscore.string');

_.mixin(s.exports());

module.exports = generators.Base.extend({
    prompting: {
        app: function() {
            var done = this.async();

            this.prompt([
                {
                    type: 'input',
                    name: 'appName',
                    message: "What's the name of the App?",
                    default: path.basename(process.cwd())
                },
                {
                    type: 'confirm',
                    name: 'i18n',
                    message: 'Do you want to include angular-translate for i18n?',
                    default: true
                },
                {
                    type: 'input',
                    name: 'locales',
                    message: 'What locales do you want to support (comma separated list)?',
                    default: null,
                    when: function(answers) {
                        return answers.i18n;
                    },
                    filter: function(answer) {
                        return answer
                            .split(',')
                            .map(function(locale) {
                                return locale.trim();
                            });
                    }
                }
            ], function (answers) {
                this.context = answers;
            });
        }
    },

    writing: {
        app: function() {
            var context = _.merge(this.context, {
                appName: this.name || path.basename(process.cwd()),
                _: _
            });

            var templatePathLength = this.templatePath().length + 1;
            var _this = this;

            glob
                .sync(this.templatePath('**/*'), {nodir: true})
                .map(function(filepath) {
                    return filepath.slice(templatePathLength);
                })
                .forEach(function(filepath) {
                    var dirname = path.dirname(filepath);
                    var srcFilename =  path.basename(filepath);
                    var destFilename = srcFilename[0] === '_' ? srcFilename.slice(1) : srcFilename;

                    _this.fs.copyTpl(
                        _this.templatePath(filepath),
                        _this.destinationPath(dirname + '/' + destFilename),
                        context
                    );
                });
        }
    },

    install: {
        npm: function() {
            this.npmInstall();
        },
        jspm: function() {
            this.runInstall('jspm', [], ['-y'])
        }
    }
});
