function en($translateProvider) {
    $translateProvider.translations('en', {
        'indexState.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    en
];
