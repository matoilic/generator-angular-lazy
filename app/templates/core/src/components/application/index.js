import './stylesheets/application.css!';
import 'babel/external-helpers';
import angular from 'angular';
import 'angular-ui-router';
import 'ui-router-extras';
import ocLazyLoad from 'oclazyload';<% if(i18n) { %>
import 'angular-translate';
import translationsModule from './i18n/translations';
import defaultLocaleConfig from './config/default-locale';<% } %>
import routingConfig from './config/routing';
import errorHandlingConfig from './config/error-handling';
import constants from './config/constants.json!';
import ApplicationController from './application-controller';
import applicationRoute from './application-route';

const dependencies = [
    'ui.router',
    ocLazyLoad,
    'ct.ui.router.extras',
    'ct.ui.router.extras.future'<% if(i18n) { %>,
    'pascalprecht.translate',
    translationsModule.name<% } %>
];

const app = angular
    .module('application-component', dependencies)
    .controller('ApplicationController', ApplicationController)
    .config(routingConfig)
    .config(applicationRoute)<% if(i18n) { %>
    .config(defaultLocaleConfig)<% } %>
    .run(errorHandlingConfig);

Object.keys(constants).forEach(function(constantName) {
    app.constant(constantName, constants[constantName]);
});

export default app;
