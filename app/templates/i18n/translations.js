import angular from 'angular';
import 'angular-translate';
<% locales.forEach(function (locale) { %>import <%= _.camelize(_.slugify(locale)) %> from './<%= _.slugify(locale) %>';
<% }) %>
const dependencies = [
    'pascalprecht.translate'
];

export default angular
    .module('application-translations', dependencies)<% locales.forEach(function (locale) { %>
    .config(<%= _.camelize(_.slugify(locale)) %>)<% }) %>;
