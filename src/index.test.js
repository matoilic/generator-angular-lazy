require('angular');
require('angular-mocks/angular-mocks');

const context = require.context('./components', true, /\.js?$/);
context.keys().filter(k => !k.match(/-test\.js/)).forEach(context);
