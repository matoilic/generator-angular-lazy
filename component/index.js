'use strict';

var Base = require('../Base');
var _ = require('../extended-lodash');

module.exports = Base.extend({
    constructor: function() {
        Base.apply(this, arguments);

        this._requireName();
        this._enablePrefix();
    },

    writing: {
        component: function() {
            var context = this._createContext();

            this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
            this._copyFile(context.componentName, 'directive', context.directiveFileName, '.js', context);
            this._copyFile(context.componentName, 'index', 'index', '.js', context);
            this._copyFile(context.componentName, 'spec', context.componentName + '-spec', '.js', context);
            this._copyFile(context.componentName, 'test', context.componentName + '-test', '.js', context);
            this._copyFile(context.componentName, 'stylesheet', context.componentName, '.scss', context);
            this._copyFile(context.componentName, 'template', context.componentName, '.html', context);
        },
        i18n: function() {
            if(!this.config.get('i18n')) {
                return;
            }

            var context = this._createContext();
            var _this = this;

            this._copyFile(context.componentName, 'translations', 'i18n/translations', '.js', context);
            context.locales.forEach(function(locale) {
                context.locale = locale;
                _this._copyFile(context.componentName, 'language', 'i18n/' + _.slugify(locale), '.js', context);
            });
        }
    },

    _createContext: function() {
        var componentName = _.slugify(_.humanize(this.name));

        return _.merge({
            componentName: componentName,
            controllerName: _.classify(componentName) + 'Controller',
            controllerFileName: componentName + '-controller',
            controllerInstanceName: _.camelize(componentName) + 'Controller',
            directiveName: _.camelize(componentName) + 'Directive',
            directiveFileName: componentName + '-directive'
        }, Base.prototype._createContext.apply(this, arguments));
    }
});
