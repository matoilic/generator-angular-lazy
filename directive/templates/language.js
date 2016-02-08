function <%= _.camelize(_.slugify(locale, true)) %>($translateProvider) {
    $translateProvider.translations('<%= locale %>', {
        '<%= componentName %>foo': 'bar'
    });
}

export default [
    '$translateProvider',
    <%= _.camelize(_.slugify(locale, true)) %>
];
