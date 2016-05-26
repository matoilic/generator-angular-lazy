'use strict';

const Base = require('../base');
const glob = require('glob');
const path = require('path');
const _ = require('../extended-lodash');
const stateUtils = require('../state-utils');

const whenI18nActive = (answers) => answers.i18n;

class ApplicationGenerator extends Base {
    constructor(args, options) {
        super(args, options);

        this.option('skip-install', {
            desc: 'Do not install dependencies',
            type: Boolean,
            defaults: false
        });

        this.option('root', {
            desc: 'Use a subfolder as root directory for the project instead of the current working directory',
            type: String,
            defaults: null
        });

        this.config.defaults({
            appName: path.basename(process.cwd()),
            i18n: true,
            bootstrapCss: false,
            bootstrapJs: false,
            indexRouteName: 'index'
        });
    }

    get prompting() {
        return {
            app() {
                const locales = this.config.get('locales') ? this.config.get('locales').join(',') : null;

                return this
                    .prompt([
                        {
                            type: 'input',
                            name: 'appName',
                            message: "What's the name of the App?",
                            default: this.config.get('appName')
                        },
                        {
                            type: 'confirm',
                            name: 'i18n',
                            message: 'Do you want to include angular-translate for i18n?',
                            default: this.config.get('i18n')
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
                            default: this.config.get('defaultLocale'),
                            choices: (answers) => answers.locales,
                            when: whenI18nActive
                        },
                        {
                            type: 'confirm',
                            name: 'bootstrapCss',
                            message: 'Do you want to include the Bootstrap CSS components?',
                            default: this.config.get('bootstrapCss')
                        },
                        {
                            type: 'confirm',
                            name: 'bootstrapJs',
                            message: 'Do you want to include the Bootstrap JavaScript componentsconst ?',
                            default: this.config.get('bootstrapJs')
                        },
                        {
                            type: 'input',
                            name: 'indexRouteName',
                            message: 'How should the default state be called?',
                            default: this.config.get('indexRouteName')
                        }
                    ])
                    .then((answers) => {
                        const root = this.config.get('root') || this.options.root;

                        this.setRootPath(root);

                        this.context = _.merge(this._createContext(), answers, { root });

                        const index = stateUtils.normalizeStateName(answers.indexRouteName);
                        this.context.indexUrl = stateUtils.normalizeUrl(index, index);
                        this.context.indexComponent = stateUtils.stateToComponentName(index);

                        return answers;
                    });
            }
        };
    }

    get configuring() {
        return {
            save() {
                this.config.set('appName', this.context.appName);
                this.config.set('i18n', this.context.i18n);
                this.config.set('locales', this.context.locales);
                this.config.set('defaultLocale', this.context.defaultLocale);
                this.config.set('indexRouteName', this.context.indexRouteName);
                this.config.set('bootstrapCss', this.context.bootstrapCss);
                this.config.set('bootstrapJs', this.context.bootstrapJs);
                this.config.set('root', this.context.root);

                this.config.save();
            }
        };
    }

    get writing() {
        return {
            core() {
                const templatePathLength = this.templatePath().length + 1;

                glob
                    .sync(this.templatePath('core/**/*'), { nodir: true })
                    .map((filepath) => filepath.slice(templatePathLength))
                    .forEach((filepath) => {
                        const dirname = path.dirname(filepath).slice(5);
                        const srcFilename = path.basename(filepath);
                        const destFilename = srcFilename[0] === '_' ? srcFilename.slice(1) : srcFilename;

                        this.fs.copyTpl(
                            this.templatePath(filepath),
                            this.rootedDestinationPath(path.join(dirname, destFilename)),
                            this.context
                        );
                    });
            },

            i18n() {
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
                    { defaultLocale: this.context.defaultLocale }
                );

                this.context.locales.forEach((locale) => {
                    this.fs.copyTpl(
                        this.templatePath('i18n/language.js'),
                        this._componentDestinationPath('application', 'i18n', `${_.slugify(locale)}.js`),
                        { _, locale }
                    );
                });
            },

            indexState() {
                this.composeWith('angular-lazy:state', {
                    arguments: [this.context.indexRouteName],
                    options: {
                        force: true
                    }
                }, {
                    local: path.join(__dirname, '..', 'state')
                });
            }
        };
    }

    get install() {
        return {
            npm() {
                if (!this.options['skip-install']) {
                    this.runInstall('npm', null, {
                        cwd: this.getRootPath() || '.'
                    });
                }
            },

            jspm() {
                if (!this.options['skip-install']) {
                    this.env.runLoop.add('install', (done) => {
                        this.emit('jspmInstall');
                        this
                            .spawnCommand('jspm', ['install'], {
                                cwd: this.getRootPath() || '.',
                                stdio: 'inherit'
                            })
                            .on('exit', () => {
                                this.emit('jspmInstall:end');
                                done();
                            });
                    }, { run: false });
                }
            }
        };
    }
}

module.exports = ApplicationGenerator;
