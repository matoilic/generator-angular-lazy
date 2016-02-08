import template from './<%= tagName %>-component.html!text';

export default {
    bindings: { },
    bindToController: true,
    controller: '<%= controllerName %>',
    require: { },
    template: template
};
