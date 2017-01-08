'use strict';

const Generator = require('yeoman-generator');
const _ = require('./extended-lodash');

class GeneratorBase extends Generator {
    getRootPath() {
        if (!this.hasOwnProperty('_rootPath')) {
            this._rootPath = this.config.get('root');
        }

        return this._rootPath;
    }

    setRootPath(value) {
        this._rootPath = value;
    }

    _componentDestinationPath() {
        let dest = ['src', 'components'];

        if (this.options.prefix) {
            dest.push(this.options.prefix);
        }

        dest = dest.concat(Array.prototype.slice.apply(arguments));

        return this.rootedDestinationPath.apply(this, dest);
    }

    _copyFile(componentName, src, dest, extension, context) {
        this.fs.copyTpl(
            this.templatePath(src + extension),
            this._componentDestinationPath(componentName, dest + extension),
            context
        );
    }

    _createContext() {
        return _.merge({
            windows: process.platform === 'win32',
            darwin: process.platform === 'darwin',
            _
        }, this.config.getAll());
    }

    rootedDestinationPath() {
        const dest = Array.prototype.slice.apply(arguments);

        if (this.getRootPath()) {
            dest.unshift(this.getRootPath());
        }

        return this.destinationPath.apply(this, dest);
    }

    _enablePrefix() {
        this.option('prefix', {
            desc: 'Write component files to a subdirectory.',
            type: String,
            required: false
        });
    }

    _requireName() {
        this.argument('name', {
            type: String,
            required: true
        });
    }
}

module.exports = GeneratorBase;
