function de($translateProvider) {
    $translateProvider.translations('de', {
        'indexState.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    de
];
