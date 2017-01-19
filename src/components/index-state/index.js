import './index-state.scss';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import translationsModule from './i18n/translations';
import IndexStateController from './index-state-controller';
import indexRouteConfig from './index-route';

const dependencies = [
    'ui.router',
    'pascalprecht.translate',
    translationsModule.name
];

export default angular
    .module('index-state-component', dependencies)
    .controller('IndexStateController', IndexStateController)
    .config(indexRouteConfig);
