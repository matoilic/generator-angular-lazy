'use strict';

import {Base} from 'yeoman-generator';
import glob from 'glob';
import path from 'path';
import _ from 'lodash';
import s from 'underscore.string';

_.mixin(s.exports());

class AppGenerator extends Base {
    constructor(args, options) {
        super(args, options);

        this.argument('name', {
            type: String,
            required: false
        });
    }

    get writing() {
        return {
            app: function() {
                const variables = {
                    appName: this.name || path.basename(process.cwd()),
                    _: _
                };
                const templatePathLength = this.templatePath().length + 1;;

                glob
                    .sync(this.templatePath('**/*'), {nodir: true})
                    .map(function(filepath) {
                        return filepath.slice(templatePathLength);
                    })
                    .forEach((filepath) => {
                        const dirname = path.dirname(filepath);
                        let srcFilename =  path.basename(filepath);
                        let destFilename = srcFilename[0] === '_' ? srcFilename.slice(1) : srcFilename;

                        this.fs.copyTpl(
                            this.templatePath(filepath),
                            this.destinationPath(`${dirname}/${destFilename}`),
                            variables
                        );
                    });
            }
        };
    }

    get install() {
        return {
            npm: function() {
                this.npmInstall();
            }
        };
    }

    end() {
        this.spawnCommand('jspm', ['install',  '-y']);
    }
}

export default AppGenerator;
