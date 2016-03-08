import template from './<%= templateName %>.html!text';

function <%= routeName %>Config($stateProvider) {
    $stateProvider
        .state('app.<%= stateName %>', {
            url: '<%= url %>',
            <% if (target) { %>views: {
                <%= target %>: {
                    controller: '<%= controllerName %> as <%= controllerInstanceName %>',
                    template
                }
            }<% } else { %>controller: '<%= controllerName %> as <%= controllerInstanceName %>',
            template<% } %>
        });
}

export default [
    '$stateProvider',
    <%= routeName %>Config
];
