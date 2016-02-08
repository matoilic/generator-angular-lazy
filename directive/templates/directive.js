import template from './<%= componentName %>.html!text';

function <%= directiveName %>() {
    return {
        restrict: 'E',
        replace: true,
        template: template,
        controller: '<%= controllerName %> as <%= controllerInstanceName %>',
        scope: {

        },
        bindToController: true
    };
}

export default[
    <%= directiveName %>
];
