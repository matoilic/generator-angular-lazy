import './application.scss';
import angular from 'angular';
import 'angular-ui-router';
import 'ui-router-extras';
import ocLazyLoad from 'oclazyload';
import ngLazy from 'angular-lazy';<% if (i18n) { %>
import 'angular-translate';
import translationsModule from './i18n/translations';
import defaultLocaleConfig from './config/default-locale';<% } %>
import routingConfig from './config/routing';
import errorHandlingConfig from './config/error-handling';
import constants from './config/constants';
import ApplicationController from './application-controller';
import applicationRoute from './application-route';

const dependencies = [
    'ui.router',
    ocLazyLoad,
    'ct.ui.router.extras',
    'ct.ui.router.extras.future',
    ngLazy.name<% if (i18n) { %>,
    'pascalprecht.translate',
    translationsModule.name<% } %>
];

const app = angular
    .module('application-component', dependencies)
    .controller('ApplicationController', ApplicationController)
    .config(routingConfig)
    .config(applicationRoute)<% if (i18n) { %>
    .config(defaultLocaleConfig)<% } %>
    .run(errorHandlingConfig);

Object.keys(constants).forEach((constantName) => {
    app.constant(constantName, constants[constantName]);
});

export default app;
