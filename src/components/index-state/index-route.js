import template from './index-state.html';

function indexRouteConfig($stateProvider) {
    $stateProvider
        .state('app.index', {
            url: 'index',
            views: {
                application: {
                    controller: 'IndexStateController as indexState',
                    template
                }
            }
        });
}

export default [
    '$stateProvider',
    indexRouteConfig
];
