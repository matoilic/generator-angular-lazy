const fs = require('fs');
const packageInfo = require('../package.json');

const packageInfoTemplate = fs.readFileSync('app/templates/core/_package.json').toString();
const requiredDependency = `"generator-angular-lazy": "~${packageInfo.version}"`;

if (packageInfoTemplate.match(requiredDependency) === null) {
    throw new Error('App template package.json might contain a wrong version of generator-angular-lazy!');
}
