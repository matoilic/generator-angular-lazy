'use strict';

const Base = require('../base');
const _ = require('../extended-lodash');

class ComponentGenerator extends Base {
    constructor(args, options) {
        super(args, options);

        this._requireName();
        this._enablePrefix();
    }

    get writing() {
        return {
            component: function () {
                const context = this._createContext();

                this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
                this._copyFile(context.componentName, 'directive', context.directiveFileName, '.js', context);
                this._copyFile(context.componentName, 'index', 'index', '.js', context);
                this._copyFile(context.componentName, 'spec', context.componentName + '-spec', '.js', context);
                this._copyFile(context.componentName, 'test', context.componentName + '-test', '.js', context);
                this._copyFile(context.componentName, 'stylesheet', context.componentName, '.scss', context);
                this._copyFile(context.componentName, 'template', context.componentName, '.html', context);
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
        const componentName = _.slugify(_.humanize(this.name));

        return _.merge({
            controllerName: _.classify(componentName) + 'Controller',
            controllerFileName: componentName + '-controller',
            controllerInstanceName: _.camelize(componentName),
            directiveName: _.camelize(componentName) + 'Directive',
            directiveFileName: componentName + '-directive',
            componentName
        }, baseContext);
    }
}

module.exports = ComponentGenerator;
