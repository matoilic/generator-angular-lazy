System.config({
    defaultJSExtensions: true,
    buildCSS: true,
    transpiler: false,
    babelOptions: {
        externalHelpers: true,
        optional: [
            'runtime',
            'optimisation.modules.system'
        ]
    },
    paths: {
        '*': 'build/*'
    }
});
