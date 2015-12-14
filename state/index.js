'use strict';

const Base = require('../base');
const _ = require('../extended-lodash');
const fs = require('fs');
const stateUtils = require('../state-utils');

class StateGenerator extends Base {
    constructor() {
        super(...arguments);

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
            targetView: function () {
                const targetComponentName = stateUtils.determineParentComponent(this.name);
                const targetTemplate = this._componentDestinationPath(targetComponentName, targetComponentName + '.html');

                if (this.options.target || !fs.existsSync(targetTemplate)) {
                    return;
                }

                const templateContent = fs.readFileSync(targetTemplate);
                const views = [];
                const viewMatcher = /(?:\sui-view="([^"]+)"|<ui-view name="([^"]+)">)/g;
                let view;
                let index = 0;

                while(view = viewMatcher.exec(templateContent)) {
                    views.push(view[1] || view[2]);
                    index = view.index;
                }

                if (views.length < 2) {
                    if (views.length === 1) {
                        this.options.target = views[0];
                    }

                    return;
                }

                var done = this.async();
                this.prompt(
                    [{
                        type: 'list',
                        name: 'target',
                        message: "Which is the target ui-view?",
                        choices: views
                    }],
                    (answers) => {
                        this.options.target = answers.target;
                        done();
                    }
                )
            }
        }
    }

    get writing() {
        return {
            state: function () {
                const context = this._createContext();

                this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
                this._copyFile(context.componentName, 'index', 'index', '.js', context);
                this._copyFile(context.componentName, 'route', context.routeFileName, '.js', context);
                this._copyFile(context.componentName, 'spec', context.componentName + '-spec', '.js', context);
                this._copyFile(context.componentName, 'test', context.componentName + '-test', '.js', context);
                this._copyFile(context.componentName, 'stylesheet', context.componentName, '.scss', context);
                this._copyFile(context.componentName, 'template', context.componentName, '.html', context);

                const routesFile = this.destinationPath('src/components/application/config/states.json');
                let routes = this.fs.readJSON(routesFile);
                routes.push({
                    name: 'app.' + context.stateName,
                    url: context.url,
                    type: 'load',
                    src: 'components/' + context.componentName + '/index'
                });
                this.fs.writeJSON(routesFile, routes);
            },

            i18n: function () {
                if (!this.config.get('i18n')) {
                    return;
                }

                const context = this._createContext();

                this._copyFile(context.componentName, 'translations', 'i18n/translations', '.js', context);
                context.locales.forEach((locale) => {
                    context.locale = locale;
                    this._copyFile(context.componentName, 'language', 'i18n/' + _.slugify(locale), '.js', context);
                });
            }
        }
    }

    _createContext() {
        const baseContext = super._createContext(...arguments);
        const stateName = stateUtils.normalizeStateName(this.name);
        const url = stateUtils.normalizeUrl(stateName, this.options.url || stateName.split('.').pop());
        const componentName = stateUtils.stateToComponentName(stateName);
        const routeFileName = componentName.slice(0, -6) + '-route';
        let target = this.options.target;

        if (!target && stateName.indexOf('.') === -1) {
            target = 'application';
        }

        return _.merge({
            controllerName: _.classify(componentName) + 'Controller',
            controllerFileName: componentName + '-controller',
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
