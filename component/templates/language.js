function <%= _.camelize(_.slugify(locale, true)) %>($translateProvider) {
    $translateProvider.translations('<%= locale %>', {
        '<%= _.camelize(tagName) %>.foo': 'bar'
    });
}

export default [
    '$translateProvider',
    <%= _.camelize(_.slugify(locale, true)) %>
];
