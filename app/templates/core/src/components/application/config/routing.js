import futureRoutes from './routes.json!';

function routingConfig($locationProvider, $urlRouterProvider, $httpProvider, $futureStateProvider) {
    $futureStateProvider.stateFactory('load', ['$q', '$ocLazyLoad', 'futureState', function($q, $ocLazyLoad, futureState) {
        return System
            .import(futureState.src)
            .then(loadedModule => {
                return $ocLazyLoad.inject(loadedModule.name || loadedModule.default.name || loadedModule);
            })
            // this needs to be done so that the future state handler doesn't use the component name as state name
            .then(() => null)
            .catch(console.error.bind(console));
    }]);

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
