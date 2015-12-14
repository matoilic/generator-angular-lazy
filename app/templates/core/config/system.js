System.config({
    defaultJSExtensions: true,
    buildCSS: true,
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
