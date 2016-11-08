function de($translateProvider) {
    $translateProvider.translations('de', {
        'application.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    de
];
