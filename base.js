'use strict';

const generators = require('yeoman-generator');
const _ = require('./extended-lodash');

class GeneratorBase extends generators.Base {
    _componentDestinationPath() {
        let dest = ['src', 'components'];

        if (this.options.prefix) {
            dest.push(this.options.prefix);
        }

        dest = dest.concat(Array.prototype.slice.apply(arguments));

        return generators.Base.prototype.destinationPath.apply(this, dest);
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

    _createContext() {
        return _.merge({
            windows: process.platform === 'win32',
            darwin: process.platform === 'darwin',
            _
        }, this.config.getAll());
    }

    _copyFile(componentName, src, dest, extension, context) {
        this.fs.copyTpl(
            this.templatePath(src + extension),
            this._componentDestinationPath(componentName, dest + extension),
            context
        );
    }
}

module.exports = GeneratorBase;
