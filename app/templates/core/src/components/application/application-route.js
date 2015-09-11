import template from './application.html!text';

function applicationRouteConfig($stateProvider) {
    $stateProvider
        .state('app', {
            url: '/',
            abstract: true,
            views: {
                page: {
                    template: template,
                    controller: 'ApplicationController as appController'
                }
            }
        });
}

export default [
    '$stateProvider',
    applicationRouteConfig
];
