import template from './application.html';

function applicationRouteConfig($stateProvider) {
    $stateProvider
        .state('app', {
            url: '/',
            abstract: true,
            views: {
                page: {
                    controller: 'ApplicationController as application',
                    template
                }
            }
        });
}

export default [
    '$stateProvider',
    applicationRouteConfig
];
