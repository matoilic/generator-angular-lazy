'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var s = require('underscore.string');

_.mixin(s.exports());

module.exports = generators.NamedBase.extend({
    constructor: function() {
        generators.NamedBase.apply(this, arguments);
    },

    writing: {
        component: function() {
            var context = this._createContext();

            this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
            this._copyFile(context.componentName, 'directive', context.directiveFileName, '.js', context);
            this._copyFile(context.componentName, 'index', 'index', '.js', context);
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

    _copyFile: function(componentName, src, dest, extension, context) {
        this.fs.copyTpl(
            this.templatePath(src + extension),
            this.destinationPath('src/components/' + componentName + '/' + dest + extension),
            context
        );
    },

    _createContext: function() {
        var componentName = _.slugify(_.humanize(this.name));

        return _.merge({
            componentName: componentName,
            controllerName: _.classify(componentName) + 'Controller',
            controllerFileName: componentName + '-controller',
            controllerInstanceName: _.camelize(componentName) + 'Controller',
            directiveName: _.camelize(componentName) + 'Directive',
            directiveFileName: componentName + '-directive',
            _: _
        }, this.config.getAll());
    }
});