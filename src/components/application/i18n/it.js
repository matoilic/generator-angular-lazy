function it($translateProvider) {
    $translateProvider.translations('it', {
        'application.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    it
];
