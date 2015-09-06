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
        component: function() {
            var stateName = this._normalizeStateName(this.name);
            var url = this._normalizeUrl(stateName, this.arguments.url || stateName.split('.').pop());
            var componentName = stateName.replace(/\./g, '-') + '-state';
            var routeFileName = componentName.slice(0, -6) + '-route';
            var context = {
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
            };

            this._copyFile(componentName, 'controller', context.controllerFileName, '.js', context);
            this._copyFile(componentName, 'index', 'index', '.js', context);
            this._copyFile(componentName, 'route', context.routeFileName, '.js', context);
            this._copyFile(componentName, 'stylesheet', componentName, '.scss', context);
            this._copyFile(componentName, 'template', componentName, '.html', context);

            var routesFile = this.destinationPath('src/components/application/config/routes.json');
            var routes = this.fs.readJSON(routesFile);
            routes.push({
                name: 'app.' + stateName,
                url: url,
                type: 'load',
                src: 'components/' + componentName + '/index'
            });
            this.fs.writeJSON(routesFile, routes);
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

    _normalizeUrl: function(url, stateName) {
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
    }
});