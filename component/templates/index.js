import './<%= componentName %>.css!'
import angular from 'angular';<% if(i18n) { %>
import angularTranslate from 'angular-translate';
import translationsModule from './i18n/translations';<% } %>
import <%= controllerName %> from './<%= controllerFileName %>';
import <%= directiveName %> from './<%= directiveFileName %>';

let dependencies = [
<% if(i18n) { %>    angularTranslate,
    translationsModule.name<% } %>
];

export default angular
    .module('<%= componentName %>-component', dependencies)
    .controller('<%= controllerName %>', <%= controllerName %>)
    .directive('<%= _.camelize(componentName) %>', <%= directiveName %>);
