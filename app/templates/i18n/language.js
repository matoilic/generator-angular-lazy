function <%= _.camelize(_.slugify(locale, true)) %>($translateProvider) {
    $translateProvider.translations('<%= locale %>', {
        'application.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    <%= _.camelize(_.slugify(locale, true)) %>
];
