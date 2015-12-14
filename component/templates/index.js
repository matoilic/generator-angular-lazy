import './<%= componentName %>.css!';
import angular from 'angular';<% if(i18n) { %>
import 'angular-translate';
import translationsModule from './i18n/translations';<% } %>
import <%= controllerName %> from './<%= controllerFileName %>';
import <%= directiveName %> from './<%= directiveFileName %>';

const dependencies = [
<% if(i18n) { %>    'pascalprecht.translate',
    translationsModule.name<% } %>
];

export default angular
    .module('<%= componentName %>-component', dependencies)
    .controller('<%= controllerName %>', <%= controllerName %>)
    .directive('<%= _.camelize(componentName) %>', <%= directiveName %>);
