function defaultLanguageConfig($translateProvider) {
    $translateProvider.preferredLanguage('de');
}

export default [
    '$translateProvider',
    defaultLanguageConfig
];
