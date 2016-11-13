module.exports = function (file, api) {
    const j = api.jscodeshift;

    const searchResults = j(file.source)
        .find(j.VariableDeclarator, {
            id: {
                name: 'states'
            }
        });

    if (searchResults.length === 0) {
        throw new Error('Could not find "states" variable.');
    }

    if (searchResults.length > 1) {
        throw new Error('Found multiple variables named "states". Cannot determine which to modify.');
    }

    return searchResults.forEach(node => {
            node.value.init.elements.push(
                j.objectExpression([
                    j.property(
                        'init',
                        j.identifier('name'),
                        j.literal('bar')
                    ),
                    j.property(
                        'init',
                        j.identifier('url'),
                        j.literal('/bar')
                    ),
                    j.property(
                        'init',
                        j.identifier('type'),
                        j.literal('load')
                    ),
                    j.property(
                        'init',
                        j.identifier('load'),
                        j.arrowFunctionExpression(
                            [],
                            j.callExpression(
                                j.memberExpression(
                                    j.identifier('System'),
                                    j.identifier('import')
                                ),
                                [j.literal('../../foo')]
                            )
                        )
                    )
                ])
            )
        })
        .toSource({
            quote: 'single',
            lineTerminator: '\n',
            wrapColumn: 120
        });
};
