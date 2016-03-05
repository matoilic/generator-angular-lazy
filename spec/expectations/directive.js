module.exports = function (name, prefix) {
    return [
        `src/components/${prefix || ''}${name}-directive/${name}-directive-controller.js`,
        `src/components/${prefix || ''}${name}-directive/${name}-directive.js`,
        `src/components/${prefix || ''}${name}-directive/${name}-directive-spec.js`,
        `src/components/${prefix || ''}${name}-directive/${name}-directive-test.js`,
        `src/components/${prefix || ''}${name}-directive/index.js`
    ];
};
