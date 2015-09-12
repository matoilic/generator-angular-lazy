System.config({
    defaultJSExtensions: true,
    transpiler: 'babel',
    babelOptions: {
        externalHelpers: true,
        optional: [
            'runtime',
            'optimisation.modules.system'
        ]
    }
});
