import './<%= tagName %>.scss';
import angular from 'angular';<% if (i18n) { %>
import 'angular-translate';
import translationsModule from './i18n/translations';<% } %>
import <%= controllerName %> from './<%= controllerFileName %>';
import <%= componentName %> from './<%= componentFileName %>';

const dependencies = [
<% if (i18n) { %>    'pascalprecht.translate',
    translationsModule.name<% } %>
];

export default angular
    .module('<%= tagName %>-component', dependencies)
    .controller('<%= controllerName %>', <%= controllerName %>)
    .component('<%= _.camelize(tagName) %>', <%= componentName %>);
