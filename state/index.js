'use strict';

const Base = require('../base');
const _ = require('../extended-lodash');
const fs = require('fs');
const stateUtils = require('../state-utils');

class StateGenerator extends Base {
    constructor(args, options) {
        super(args, options);

        this._requireName();
        this._enablePrefix();

        this.option('url', {
            desc: 'Url relative to the parent state. Same as state name by default.',
            type: String,
            required: false
        });

        this.option('target', {
            desc: 'Name of the target ui-view within the parent state.',
            type: String,
            required: false
        });
    }

    get prompting() {
        return {
            targetView() {
                const targetComponentName = stateUtils.determineParentComponent(this.options.name);
                const targetTemplate = this._componentDestinationPath(
                    targetComponentName,
                    `${targetComponentName}.html`
                );

                if (this.options.target || !fs.existsSync(targetTemplate)) {
                    return Promise.resolve();
                }

                const templateContent = fs.readFileSync(targetTemplate);
                const views = [];
                const viewMatcher = /(?:\sui-view="([^"]+)"|<ui-view name="([^"]+)">)/g;
                let view = viewMatcher.exec(templateContent);

                while (view) {
                    views.push(view[1] || view[2]);
                    view = viewMatcher.exec(templateContent);
                }

                if (views.length < 2) {
                    if (views.length === 1) {
                        this.options.target = views[0];
                    }

                    return Promise.resolve();
                }

                return this
                    .prompt([{
                        type: 'list',
                        name: 'target',
                        message: 'Which is the target ui-view?',
                        choices: views
                    }])
                    .then((answers) => {
                        this.options.target = answers.target;

                        return answers;
                    });
            }
        };
    }

    get writing() {
        return {
            state() {
                const context = this._createContext();

                this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
                this._copyFile(context.componentName, 'index', 'index', '.js', context);
                this._copyFile(context.componentName, 'route', context.routeFileName, '.js', context);
                this._copyFile(context.componentName, 'spec', `${context.componentName}-spec`, '.js', context);
                this._copyFile(context.componentName, 'test', `${context.componentName}-test`, '.js', context);
                this._copyFile(context.componentName, 'stylesheet', context.componentName, '.scss', context);
                this._copyFile(context.componentName, 'template', context.componentName, '.html', context);

                const routesFile = this.rootedDestinationPath('src/components/application/config/states.json');
                const routes = this.fs.readJSON(routesFile);

                const srcPath = ['components'];
                if (this.options.prefix) {
                    srcPath.push(this.options.prefix);
                }
                srcPath.push(context.componentName, 'index');

                routes.push({
                    name: `app.${context.stateName}`,
                    url: context.url,
                    type: 'load',
                    src: srcPath.join('/')
                });
                this.fs.writeJSON(routesFile, routes);
            },

            i18n() {
                if (!this.config.get('i18n')) {
                    return;
                }

                const context = this._createContext();

                this._copyFile(context.componentName, 'translations', 'i18n/translations', '.js', context);
                context.locales.forEach((locale) => {
                    context.locale = locale;
                    this._copyFile(context.componentName, 'language', `i18n/${_.slugify(locale)}`, '.js', context);
                });
            }
        };
    }

    _createContext() {
        const baseContext = super._createContext();
        const stateName = stateUtils.normalizeStateName(this.options.name);
        const url = stateUtils.normalizeUrl(stateName, this.options.url || stateName.split('.').pop());
        const componentName = stateUtils.stateToComponentName(stateName);
        const routeFileName = `${componentName.slice(0, -6)}-route`;
        let target = this.options.target;

        if (!target && stateName.indexOf('.') === -1) {
            target = 'application';
        }

        return _.merge({
            controllerName: `${_.classify(componentName)}Controller`,
            controllerFileName: `${componentName}-controller`,
            controllerInstanceName: _.camelize(componentName),
            routeName: _.camelize(routeFileName),
            templateName: componentName,
            componentName,
            stateName,
            url,
            target,
            routeFileName
        }, baseContext);
    }
}

module.exports = StateGenerator;
