import futureStates from './states.js';

function routingConfig($locationProvider, $urlRouterProvider, $httpProvider, $futureStateProvider) {
    futureStates.forEach((state) => $futureStateProvider.futureState(state));
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
