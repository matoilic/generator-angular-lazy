System.config({
    defaultJSExtensions: true,
    buildCSS: false,
    transpiler: 'babel',
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
