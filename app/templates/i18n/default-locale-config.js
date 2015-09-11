function defaultLanguageConfig($translateProvider) {
    $translateProvider.preferredLanguage('<%= defaultLocale %>');
}

export default [
    '$translateProvider',
    defaultLanguageConfig
];
