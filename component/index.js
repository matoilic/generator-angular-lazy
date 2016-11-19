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
            component() {
                const context = this._createContext();

                this._copyFile(context.tagName, 'controller', context.controllerFileName, '.js', context);
                this._copyFile(context.tagName, 'component', context.componentFileName, '.js', context);
                this._copyFile(context.tagName, 'index', 'index', '.js', context);
                this._copyFile(context.tagName, 'spec', `${context.tagName}-component-spec`, '.js', context);
                this._copyFile(context.tagName, 'test', `${context.tagName}-component-test`, '.js', context);
                this._copyFile(context.tagName, '_stylesheet', `_${context.tagName}-component`, '.scss', context);
                this._copyFile(context.tagName, 'template', `${context.tagName}-component`, '.html', context);
            },

            i18n() {
                if (!this.config.get('i18n')) {
                    return;
                }

                const context = this._createContext();

                this._copyFile(context.tagName, 'translations', 'i18n/translations', '.js', context);
                context.locales.forEach((locale) => {
                    context.locale = locale;
                    this._copyFile(context.tagName, 'language', `i18n/${_.slugify(locale)}`, '.js', context);
                });
            }
        };
    }

    get install() {
        return {
            stylesheet() {
                const context = this._createContext();

                this.installStylesheet(context.tagName, `${context.tagName}-component.scss`);
            }
        };
    }

    _createContext() {
        const baseContext = super._createContext();
        const tagName = _.slugify(_.humanize(this.name));

        return _.merge({
            controllerName: `${_.classify(tagName)}ComponentController`,
            controllerFileName: `${tagName}-component-controller`,
            componentName: `${_.camelize(tagName)}Component`,
            componentFileName: `${tagName}-component`,
            tagName
        }, baseContext);
    }
}

module.exports = ComponentGenerator;
