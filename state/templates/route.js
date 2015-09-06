import template from './<%= templateName %>.html!text';

function <%= routeName %>Config($stateProvider) {
    $stateProvider
        .state('app.<%= stateName %>', {
            url: '<%= url %>',
            views: {
                content: {
                    template: template,
                    controller: '<%= controllerName %> as <%= controllerInstanceName %>'
                }
            }
        });
}

export default [
    '$stateProvider',
    <%= routeName %>Config
];
