function it($translateProvider) {
    $translateProvider.translations('it', {
        'indexState.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    it
];
