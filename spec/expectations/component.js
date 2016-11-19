module.exports = function (name, prefix) {
    return [
        `src/components/${prefix || ''}${name}/${name}-component-controller.js`,
        `src/components/${prefix || ''}${name}/${name}-component.js`,
        `src/components/${prefix || ''}${name}/_${name}-component.scss`,
        `src/components/${prefix || ''}${name}/${name}-component.html`,
        `src/components/${prefix || ''}${name}/${name}-component-spec.js`,
        `src/components/${prefix || ''}${name}/${name}-component-test.js`,
        `src/components/${prefix || ''}${name}/index.js`
    ];
};
