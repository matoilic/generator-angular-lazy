'use strict';

var Base = require('../base');
var glob = require('glob');
var path = require('path');
var _ = require('../extended-lodash');
var stateUtils = require('../state-utils');

function whenI18nActive(answers) {
    return answers.i18n;
}

module.exports = Base.extend({
    constructor: function() {
        Base.apply(this, arguments);

        this.option('skip-install', {
            desc: 'Do not install dependencies',
            type: Boolean,
            defaults: false
        });
    },

    prompting: {
        app: function() {
            var done = this.async();
            var _this = this;

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
                    when: whenI18nActive,
                    filter: function(answer) {
                        return answer
                            .split(',')
                            .map(function(locale) {
                                return locale.trim();
                            });
                    }
                },
                {
                    type: 'list',
                    name: 'defaultLocale',
                    message: 'Which should be the default locale?',
                    choices: function(answers) {
                        return answers.locales;
                    },
                    when: whenI18nActive
                },
                {
                    type: 'input',
                    name: 'indexRouteName',
                    message: "How should the default state be called?",
                    default: 'home'
                }
            ], function (answers) {
                var index = stateUtils.normalizeStateName(answers.indexRouteName);

                _this.context = _.merge(_this._createContext(), answers);
                _this.context.indexUrl = stateUtils.normalizeUrl(index, index);
                _this.context.indexComponent = stateUtils.stateToComponentName(index);

                done();
            });
        }
    },

    configuring: {
        save: function() {
            this.config.set('appName', this.context.appName);
            this.config.set('i18n', this.context.i18n);
            this.config.set('locales', this.context.locales);
            this.config.set('defaultLocale', this.context.defaultLocale);
            this.config.save();
        }
    },

    writing: {
        core: function() {
            var templatePathLength = this.templatePath().length + 1;
            var _this = this;

            glob
                .sync(this.templatePath('core/**/*'), {nodir: true})
                .map(function(filepath) {
                    return filepath.slice(templatePathLength);
                })
                .forEach(function(filepath) {
                    var dirname = path.dirname(filepath).slice(5);
                    var srcFilename =  path.basename(filepath);
                    var destFilename = srcFilename[0] === '_' ? srcFilename.slice(1) : srcFilename;

                    _this.fs.copyTpl(
                        _this.templatePath(filepath),
                        _this.destinationPath(path.join(dirname, destFilename)),
                        _this.context
                    );
                });
        },
        i18n: function() {
            if(!this.context.i18n) {
                return;
            }

            this.fs.copyTpl(
                this.templatePath('i18n/translations.js'),
                this._componentDestinationPath('application', 'i18n', 'translations.js'),
                this.context
            );

            this.fs.copyTpl(
                this.templatePath('i18n/default-locale-config.js'),
                this._componentDestinationPath('application', 'config', 'default-locale.js'),
                {defaultLocale: this.context.defaultLocale}
            );

            var _this = this;
            this.context.locales.forEach(function(locale) {
                _this.fs.copyTpl(
                    _this.templatePath('i18n/language.js'),
                    _this._componentDestinationPath('application', 'i18n', _.slugify(locale) + '.js'),
                    {
                        _: _,
                        locale: locale
                    }
                );
            });
        }
    },

    install: {
        npm: function() {
            if(!this.options['skip-install']) {
                this.runInstall('npm');
            }
        },
        jspm: function() {
            if(!this.options['skip-install']) {
                this.runInstall('jspm');
            }
        }
    },

    end: function() {
        this.composeWith('angular-lazy:state', {
            arguments: [this.context.indexRouteName],
            options: {
                force: true
            }
        });
    }
});
