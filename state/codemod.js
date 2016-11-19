module.exports = function (file, api, options) {
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

    const existingDefinition = searchResults
        .find(j.Property, {
            key: {
                name: 'name'
            },
            value: {
                value: options.stateName
            }
        });

    if (existingDefinition.length > 0) {
        return undefined;
    }

    return searchResults
        .forEach(node => {
            node.value.init.elements.push(
                j.objectExpression([
                    j.property(
                        'init',
                        j.identifier('name'),
                        j.literal(options.stateName)
                    ),
                    j.property(
                        'init',
                        j.identifier('url'),
                        j.literal(options.stateUrl)
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
                                [j.literal(options.stateSrc)]
                            )
                        )
                    )
                ])
            );
        })
        .toSource({
            quote: 'single',
            lineTerminator: '\n',
            wrapColumn: 120
        });
};
