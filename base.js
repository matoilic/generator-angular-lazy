'use strict';

const _ = require('./extended-lodash');
const fs = require('fs');
const generators = require('yeoman-generator');
const path = require('path');

class GeneratorBase extends generators.Base {
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

    normalizeFilename(filename) {
        const fileExtension = filename.split('.').pop();

        if (filename[0] === '_' && fileExtension !== 'scss') {
            return filename.slice(1);
        }

        return filename;
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

    installStylesheet(...args) {
        const indexStyleFile = this.rootedDestinationPath('src', 'index.scss');
        let contents = fs.readFileSync(indexStyleFile).toString();
        const marker = '/* components:end */';

        const relative = path.relative(
            this.rootedDestinationPath('src'),
            this._componentDestinationPath(...args).slice(0, -5)
        );

        const importStatement = `@import "${relative.replace(/\\/g, '/')}";`;

        if (contents.indexOf(importStatement) === -1) {
            contents = contents.replace(
                marker,
                `${importStatement}\n${marker}`
            );
        }

        fs.writeFileSync(indexStyleFile, contents);
    }
}

module.exports = GeneratorBase;
