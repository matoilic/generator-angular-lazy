import template from './<%= templateName %>.html!text';

function <%= routeName %>Config($stateProvider) {
    $stateProvider
        .state('app.<%= stateName %>', {
            url: '<%= url %>',
            <% if(target) { %>views: {
                <%= target %>: {
                    template: template,
                    controller: '<%= controllerName %> as <%= controllerInstanceName %>'
                }
            }<% } else { %>template: template,
            controller: '<%= controllerName %> as <%= controllerInstanceName %>'<% } %>
        });
}

export default [
    '$stateProvider',
    <%= routeName %>Config
];
