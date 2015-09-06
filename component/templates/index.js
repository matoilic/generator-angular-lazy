import './<%= componentName %>.css!'
import angular from 'angular';
import <%= controllerName %> from './<%= controllerFileName %>';
import <%= directiveName %> from './<%= directiveFileName %>';

let dependencies = [

];

export default angular
    .module('<%= componentName %>-component', dependencies)
    .controller('<%= controllerName %>', <%= controllerName %>)
    .directive('<%= _.camelize(componentName) %>', <%= directiveName %>);
