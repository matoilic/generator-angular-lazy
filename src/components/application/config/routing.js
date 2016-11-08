import futureStates from './states';

function routingConfig($locationProvider, $urlRouterProvider, $httpProvider, $futureStateProvider) {
    $futureStateProvider.stateFactory('load', ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
        return futureState
            .src()
            .then(loadedModule => {
                return $ocLazyLoad.inject(loadedModule.name || loadedModule.default.name || loadedModule);
            })
            // this needs to be done so that the future state handler doesn't use the component name as state name
            .then(() => null)
            .catch(console.error.bind(console));
    }]);

    $futureStateProvider.stateFactory('given', ['$q', ($q) => $q.resolve(null)]);

    futureStates.forEach((state) => $futureStateProvider.futureState(state));
    $httpProvider.useApplyAsync(true);
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/index');
    $urlRouterProvider.when('/', '/index');
}

export default [
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$futureStateProvider',
    routingConfig
];
