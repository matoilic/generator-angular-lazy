import './<%= componentName %>.css!'
import angular from 'angular';
import uiRouter from 'angular-ui-router';<% if(i18n) { %>
import angularTranslate from 'angular-translate';
import translationsModule from './i18n/translations';<% } %>
import <%= controllerName %> from './<%= controllerFileName %>';
import <%= routeName %>Config from './<%= routeFileName %>';

let dependencies = [
    uiRouter<% if(i18n) { %>,
    angularTranslate,
    translationsModule.name<% } %>
];

export default angular
    .module('<%= componentName %>-component', dependencies)
    .controller('<%= controllerName %>', <%= controllerName %>)
    .config(<%= routeName %>Config);
