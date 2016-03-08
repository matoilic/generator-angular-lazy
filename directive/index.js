/*eslint-disable */
'use strict';
/*eslint-enable */

const Base = require('../base');
const _ = require('../extended-lodash');

class DirectiveGenerator extends Base {
    constructor(args, options) {
        super(args, options);

        this._requireName();
        this._enablePrefix();
    }

    get writing() {
        return {
            component() {
                const context = this._createContext();

                this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
                this._copyFile(context.componentName, 'directive', context.directiveFileName, '.js', context);
                this._copyFile(context.componentName, 'index', 'index', '.js', context);
                this._copyFile(context.componentName, 'spec', `${context.componentName}-spec`, '.js', context);
                this._copyFile(context.componentName, 'test', `${context.componentName}-test`, '.js', context);
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
        const componentName = `${_.slugify(_.humanize(this.name))}-directive`;

        return _.merge({
            controllerName: `${_.classify(componentName)}Controller`,
            controllerFileName: `${componentName}-controller`,
            controllerInstanceName: _.camelize(componentName),
            directiveName: _.camelize(componentName),
            directiveFileName: componentName,
            attributeName: _.slugify(_.humanize(this.name)),
            componentName
        }, baseContext);
    }
}

module.exports = DirectiveGenerator;
