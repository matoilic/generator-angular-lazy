'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var s = require('underscore.string');
var path = require('path');

_.mixin(s.exports());

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
    },

    _componentDestinationPath: function() {
        var dest = ['src', 'components'];

        if(this.options.prefix) {
            dest.push(this.options.prefix);
        }

        dest = dest.concat(Array.prototype.slice.apply(arguments));

        return generators.Base.prototype.destinationPath.apply(this, dest);
    },

    _enablePrefix: function() {
        this.option('prefix', {
            desc: 'Write component files to a subdirectory.',
            type: String,
            required: false
        });
    },

    _requireName: function() {
        this.argument('name', {
            type: String,
            required: true
        });
    },

    _createContext: function() {
        return _.merge({
            windows: process.platform === 'win32',
            darwin: process.platform === 'darwin',
            _: _
        }, this.config.getAll());
    },

    _copyFile: function(componentName, src, dest, extension, context) {
        this.fs.copyTpl(
            this.templatePath(src + extension),
            this._componentDestinationPath(componentName, dest + extension),
            context
        );
    }
});
