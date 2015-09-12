'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var s = require('underscore.string');

_.mixin(s.exports());

module.exports = generators.NamedBase.extend({
    constructor: function() {
        generators.NamedBase.apply(this, arguments);

        this.argument('url', {
            type: String,
            required: false
        });
    },

    writing: {
        state: function() {
            var context = this._createContext();

            this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
            this._copyFile(context.componentName, 'index', 'index', '.js', context);
            this._copyFile(context.componentName, 'route', context.routeFileName, '.js', context);
            this._copyFile(context.componentName, 'spec', context.componentName + '-spec', '.js', context);
            this._copyFile(context.componentName, 'stylesheet', context.componentName, '.scss', context);
            this._copyFile(context.componentName, 'template', context.componentName, '.html', context);

            var routesFile = this.destinationPath('src/components/application/config/routes.json');
            var routes = this.fs.readJSON(routesFile);
            routes.push({
                name: 'app.' + context.stateName,
                url: context.url,
                type: 'load',
                src: 'components/' + context.componentName + '/index'
            });
            this.fs.writeJSON(routesFile, routes);
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

    _normalizeStateName: function(stateName) {
        var stateName = this.name;
        if(stateName.indexOf('app.') === 0) {
            stateName = stateName.slice(4);
        }

        return stateName
            .split('.')
            .map(function(part) {
                return _.slugify(_.humanize(part))
            })
            .join('.');
    },

    _normalizeUrl: function(stateName, url) {
        var leadingSlashRequired = stateName.indexOf('.') > -1;
        var hasLeadingSlash = url[0] === '/';

        if(leadingSlashRequired && !hasLeadingSlash) {
            url = '/' + url;
        } else if(!leadingSlashRequired && hasLeadingSlash) {
            url = url.slice(1);
        }

        if(url.slice(-1) === '/') {
            url = url.slice(0, -1);
        }

        return url;
    },

    _createContext: function() {
        var stateName = this._normalizeStateName(this.name);
        var url = this._normalizeUrl(stateName, this.options.url || stateName.split('.').pop());
        var componentName = stateName.replace(/\./g, '-') + '-state';
        var routeFileName = componentName.slice(0, -6) + '-route';

        return _.merge({
            componentName: componentName,
            stateName: stateName,
            url: url,
            controllerName: _.classify(componentName) + 'Controller',
            controllerFileName: componentName + '-controller',
            controllerInstanceName: _.camelize(componentName) + 'Controller',
            routeName: _.camelize(routeFileName),
            routeFileName: routeFileName,
            templateName: componentName,
            _: _
        }, this.config.getAll());
    }
});