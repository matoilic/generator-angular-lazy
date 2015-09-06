import './stylesheets/application.css!';
import 'babel-core/external-helpers';
import routingConfig from './config/routing';
import errorHandlingConfig from './config/error-handling';
import constants from './config/constants.json!';
import angular from 'angular';
import 'angular-ui-router';
import 'ui-router-extras';
import 'oclazyload';
import ApplicationController from './application-controller';
import applicationRoute from './application-route';

const dependencies = [
    'ui.router',
    'oc.lazyLoad',
    'ct.ui.router.extras',
    'ct.ui.router.extras.future'
];

const app = angular
    .module('application', dependencies)
    .controller('ApplicationController', ApplicationController)
    .config(routingConfig)
    .config(applicationRoute)
    .run(errorHandlingConfig);

Object.keys(constants).forEach(function(constantName) {
    app.constant(constantName, constants[constantName]);
});

export default app;
