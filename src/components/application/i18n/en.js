function en($translateProvider) {
    $translateProvider.translations('en', {
        'application.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    en
];
