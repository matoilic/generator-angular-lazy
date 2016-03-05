module.exports = function (name, prefix) {
    return [
        `src/components/${prefix || ''}${name}/i18n/de.js`,
        `src/components/${prefix || ''}${name}/i18n/en.js`,
        `src/components/${prefix || ''}${name}/i18n/fr.js`,
        `src/components/${prefix || ''}${name}/i18n/translations.js`
    ];
};
