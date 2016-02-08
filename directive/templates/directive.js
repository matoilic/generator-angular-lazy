function <%= directiveName %>() {
    return {
        restrict: 'A',
        controller: '<%= controllerName %> as $ctrl'
    };
}

export default[
    <%= directiveName %>
];
