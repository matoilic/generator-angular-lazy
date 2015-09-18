'use strict';

var Base = require('../Base');
var _ = require('lodash');
var s = require('underscore.string');
var fs = require('fs');

_.mixin(s.exports());

module.exports = Base.extend({
    constructor: function() {
        Base.apply(this, arguments);

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
    },

    prompting: {
        targetView: function() {
            var targetComponentName = this._determineParentComponent(this.name);
            var targetTemplate = this._componentDestinationPath(targetComponentName, targetComponentName + '.html');

            if(this.options.target || !fs.existsSync(targetTemplate)) {
                return;
            }

            var templateContent = fs.readFileSync(targetTemplate);
            var views = [];
            var viewMatcher = /(?:\sui-view="([^"]+)"|<ui-view name="([^"]+)">)/g;
            var view;
            var index = 0;

            while(view = viewMatcher.exec(templateContent)) {
                views.push(view[1] || view[2]);
                index = view.index;
            }

            if(views.length < 2) {
                if(views.length === 1) {
                    this.options.target = views[0];
                }

                return;
            }

            var _this = this;
            var done = this.async();
            this.prompt([
                {
                    type: 'list',
                    name: 'target',
                    message: "Which is the target ui-view?",
                    choices: views
                }
            ], function(answers) {
                _this.options.target = answers.target;
                done();
            })
        }
    },

    writing: {
        state: function() {
            var context = this._createContext();

            this._copyFile(context.componentName, 'controller', context.controllerFileName, '.js', context);
            this._copyFile(context.componentName, 'index', 'index', '.js', context);
            this._copyFile(context.componentName, 'route', context.routeFileName, '.js', context);
            this._copyFile(context.componentName, 'spec', context.componentName + '-spec', '.js', context);
            this._copyFile(context.componentName, 'test', context.componentName + '-test', '.js', context);
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

    _normalizeStateName: function(stateName) {
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

    _stateToComponentName: function(stateName) {
        return stateName.replace(/\./g, '-') + '-state';
    },

    _createContext: function() {
        var stateName = this._normalizeStateName(this.name);
        var url = this._normalizeUrl(stateName, this.options.url || stateName.split('.').pop());
        var componentName = this._stateToComponentName(stateName);
        var routeFileName = componentName.slice(0, -6) + '-route';
        var target = this.options.target;

        if(!target && stateName.indexOf('.') === -1) {
            target = 'application';
        }

        return _.merge({
            componentName: componentName,
            stateName: stateName,
            url: url,
            target: target,
            controllerName: _.classify(componentName) + 'Controller',
            controllerFileName: componentName + '-controller',
            controllerInstanceName: _.camelize(componentName) + 'Controller',
            routeName: _.camelize(routeFileName),
            routeFileName: routeFileName,
            templateName: componentName,
        }, Base.prototype._createContext.apply(this, arguments));
    },

    _determineParentComponent: function(stateName) {
        stateName = this._normalizeStateName(stateName);

        if(stateName.indexOf('.') === -1) {
            return 'application';
        }

        return this._stateToComponentName(
            stateName.slice(0, stateName.lastIndexOf('.'))
        );
    }
});
