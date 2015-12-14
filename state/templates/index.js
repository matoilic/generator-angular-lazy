import './<%= componentName %>.css!';
import angular from 'angular';
import 'angular-ui-router';<% if (i18n) { %>
import 'angular-translate';
import translationsModule from './i18n/translations';<% } %>
import <%= controllerName %> from './<%= controllerFileName %>';
import <%= routeName %>Config from './<%= routeFileName %>';

const dependencies = [
    'ui.router'<% if (i18n) { %>,
    'pascalprecht.translate',
    translationsModule.name<% } %>
];

export default angular
    .module('<%= componentName %>-component', dependencies)
    .controller('<%= controllerName %>', <%= controllerName %>)
    .config(<%= routeName %>Config);
