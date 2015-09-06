import './<%= componentName %>.css!'
import angular from 'angular';
import <%= controllerName %> from './<%= controllerFileName %>';
import <%= routeName %>Config from './<%= routeFileName %>';

let dependencies = [

];

export default angular
    .module('<%= componentName %>-component', dependencies)
    .controller('<%= controllerName %>', <%= controllerName %>)
    .config(<%= routeName %>Config);
