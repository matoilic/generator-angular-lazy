'use strict';

const Base = require('../base');
const glob = require('glob');
const path = require('path');
const _ = require('../extended-lodash');
const stateUtils = require('../state-utils');

const whenI18nActive = (answers) => answers.i18n;

class ApplicationGenerator extends Base {
    constructor() {
        super(...arguments);

        this.option('skip-install', {
            desc: 'Do not install dependencies',
            type: Boolean,
            defaults: false
        });
    }

    get prompting() {
        return {
            app: function () {
                const done = this.async();
                const locales = this.config.get('locales') ? this.config.get('locales').join(',') : null;

                this.prompt([
                    {
                        type: 'input',
                        name: 'appName',
                        message: "What's the name of the App?",
                        default: this.config.get('appName') || path.basename(process.cwd())
                    },
                    {
                        type: 'confirm',
                        name: 'i18n',
                        message: 'Do you want to include angular-translate for i18n?',
                        default: this.config.get('i18n') || true
                    },
                    {
                        type: 'input',
                        name: 'locales',
                        message: 'What locales do you want to support (comma separated list)?',
                        default: locales,
                        when: whenI18nActive,
                        filter: (answer) => _.uniq(
                            answer
                                .split(',')
                                .map((locale) => locale.trim())
                        )
                    },
                    {
                        type: 'list',
                        name: 'defaultLocale',
                        message: 'Which should be the default locale?',
                        default: this.config.get('defaultLocale') || true,
                        choices: (answers) => answers.locales,
                        when: whenI18nActive
                    },
                    {
                        type: 'confirm',
                        name: 'bootstrapCss',
                        message: 'Do you want to include the Bootstrap CSS components?',
                        default: !!this.config.get('bootstrapCss')
                    },
                    {
                        type: 'confirm',
                        name: 'bootstrapJs',
                        message: 'Do you want to include the Bootstrap JavaScript componentsconst ?',
                        default: !!this.config.get('bootstrapJs')
                    },
                    {
                        type: 'input',
                        name: 'indexRouteName',
                        message: "How should the default state be called?",
                        default: this.config.get('indexRouteName') || 'home'
                    }
                ], (answers) => {
                    this.context = _.merge(this._createContext(), answers);

                    let index = stateUtils.normalizeStateName(answers.indexRouteName);
                    this.context.indexUrl = stateUtils.normalizeUrl(index, index);
                    this.context.indexComponent = stateUtils.stateToComponentName(index);

                    done();
                });
            }
        }
    }

    get configuring() {
        return {
            save: function () {
                this.config.set('appName', this.context.appName);
                this.config.set('i18n', this.context.i18n);
                this.config.set('locales', this.context.locales);
                this.config.set('defaultLocale', this.context.defaultLocale);
                this.config.set('indexRouteName', this.context.indexRouteName);
                this.config.set('bootstrapCss', this.context.bootstrapCss);
                this.config.set('bootstrapJs', this.context.bootstrapJs);
                this.config.save();
            }
        }
    }

    get writing() {
        return {
            core: function () {
                const templatePathLength = this.templatePath().length + 1;

                glob
                    .sync(this.templatePath('core/**/*'), {nodir: true})
                    .map((filepath) => filepath.slice(templatePathLength))
                    .forEach((filepath) => {
                        const dirname = path.dirname(filepath).slice(5);
                        const srcFilename =  path.basename(filepath);
                        const destFilename = srcFilename[0] === '_' ? srcFilename.slice(1) : srcFilename;

                        this.fs.copyTpl(
                            this.templatePath(filepath),
                            this.destinationPath(path.join(dirname, destFilename)),
                            this.context
                        );
                    });
            },

            i18n: function () {
                if (!this.context.i18n) {
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

                this.context.locales.forEach((locale) => {
                    this.fs.copyTpl(
                        this.templatePath('i18n/language.js'),
                        this._componentDestinationPath('application', 'i18n', _.slugify(locale) + '.js'),
                        {_, locale}
                    );
                });
            }
        }
    }

    get install() {
        return {
            npm: function () {
                if (!this.options['skip-install']) {
                    this.runInstall('npm');
                }
            },

            jspm: function () {
                if (!this.options['skip-install']) {
                    this.runInstall('jspm');
                }
            }
        }
    }

    end() {
        this.composeWith('angular-lazy:state', {
            arguments: [this.context.indexRouteName],
            options: {
                force: true
            }
        });
    }
}

module.exports = ApplicationGenerator;
