import futureRoutes from './routes.json!';

function routingConfig($locationProvider, $urlRouterProvider, $httpProvider, $stateProvider, $futureStateProvider) {
    $futureStateProvider.stateFactory('load', ['$q', '$ocLazyLoad', 'futureState', function($q, $ocLazyLoad, futureState) {
        const def = $q.defer();

        System.import(futureState.src).then(loaded => {
            let newModule = loaded;
            if (!loaded.name) {
                var key = Object.keys(loaded);
                newModule = loaded[key[0]];
            }

            $ocLazyLoad.load(newModule).then(function() {
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
    '$stateProvider', 
    '$futureStateProvider',
    routingConfig
];