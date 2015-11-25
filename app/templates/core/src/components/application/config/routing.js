import futureRoutes from './routes.json!';

function routingConfig($locationProvider, $urlRouterProvider, $httpProvider, $futureStateProvider) {
    futureRoutes.forEach(function(r) {
        $futureStateProvider.futureState(r);
    });

    $httpProvider.useApplyAsync(true);
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/<%= indexUrl %>');
    $urlRouterProvider.when('/', '/<%= indexUrl %>');
}

export default [
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$futureStateProvider',
    routingConfig
];
