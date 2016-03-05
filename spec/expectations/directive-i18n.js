module.exports = function (name, prefix) {
    return [
        `src/components/${prefix || ''}${name}-directive/i18n/de.js`,
        `src/components/${prefix || ''}${name}-directive/i18n/en.js`,
        `src/components/${prefix || ''}${name}-directive/i18n/fr.js`,
        `src/components/${prefix || ''}${name}-directive/i18n/translations.js`
    ];
};
