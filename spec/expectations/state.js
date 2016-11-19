module.exports = function (name, prefix) {
    return [
        `src/components/${prefix || ''}${name}-state`,
        `src/components/${prefix || ''}${name}-state/index.js`,
        `src/components/${prefix || ''}${name}-state/${name}-route.js`,
        `src/components/${prefix || ''}${name}-state/${name}-state-controller.js`,
        `src/components/${prefix || ''}${name}-state/${name}-state.html`,
        `src/components/${prefix || ''}${name}-state/_${name}-state.scss`,
        `src/components/${prefix || ''}${name}-state/${name}-state-spec.js`,
        `src/components/${prefix || ''}${name}-state/${name}-state-test.js`
    ];
};
