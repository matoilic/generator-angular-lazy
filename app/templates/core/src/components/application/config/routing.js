import futureRoutes from './routes.json!';

function routingConfig($locationProvider, $urlRouterProvider, $httpProvider, $futureStateProvider) {
    $futureStateProvider.stateFactory('load', ['$q', '$ocLazyLoad', 'futureState', function($q, $ocLazyLoad, futureState) {
        const def = $q.defer();

        System.import(futureState.src).then(loadedModule => {
            $ocLazyLoad.inject(loadedModule.name).then(function() {
                def.resolve();
            });
        });

        return def.promise;
    }]);

    futureRoutes.forEach(function(r) {
        $futureStateProvider.futureState(r);
    });
    
    $httpProvider.useApplyAsync(true);
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/home');
    $urlRouterProvider.when('/', '/home');
}

export default [
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$futureStateProvider',
    routingConfig
];