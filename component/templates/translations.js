import angular from 'angular';
import angularTranslate from 'angular-translate';
<% locales.forEach(function(locale) { %>import <%= _.camelize(_.slugify(locale)) %> from './<%= _.slugify(locale) %>';
<% }) %>
const dependencies = [
    angularTranslate
];

export default angular
    .module('<%= componentName %>-component-translations', dependencies)<% locales.forEach(function(locale) { %>
    .config(<%= _.camelize(_.slugify(locale)) %>)<% }) %>;
