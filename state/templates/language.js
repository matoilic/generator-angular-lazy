function <%= _.camelize(_.slugify(locale, true)) %>($translateProvider) {
    $translateProvider.translations('<%= locale %>', {
        '<%= _.camelize(componentName) %>.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    <%= _.camelize(_.slugify(locale, true)) %>
];
