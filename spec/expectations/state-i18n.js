module.exports = function (name, prefix) {
    return [
        `src/components/${prefix || ''}${name}-state/i18n/de.js`,
        `src/components/${prefix || ''}${name}-state/i18n/en.js`,
        `src/components/${prefix || ''}${name}-state/i18n/fr.js`,
        `src/components/${prefix || ''}${name}-state/i18n/translations.js`
    ];
};
