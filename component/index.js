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
            var componentName = _.slugify(_.humanize(this.name));
            var context = {
                componentName: componentName,
                controllerName: _.classify(componentName) + 'Controller',
                controllerFileName: componentName + '-controller',
                controllerInstanceName: _.camelize(componentName) + 'Controller',
                directiveName: _.camelize(componentName) + 'Directive',
                directiveFileName: componentName + '-directive',
                _: _
            };

            this._copyFile(componentName, 'controller', context.controllerFileName, '.js', context);
            this._copyFile(componentName, 'directive', context.directiveFileName, '.js', context);
            this._copyFile(componentName, 'index', 'index', '.js', context);
            this._copyFile(componentName, 'stylesheet', componentName, '.scss', context);
            this._copyFile(componentName, 'template', componentName, '.html', context);
        }
    },

    _copyFile: function(componentName, src, dest, extension, context) {
        this.fs.copyTpl(
            this.templatePath(src + extension),
            this.destinationPath('src/components/' + componentName + '/' + dest + extension),
            context
        );
    }
});