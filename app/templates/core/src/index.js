import 'babel/external-helpers';
import angular from 'angular';
import appModule from './components/application/index';

angular.element(document).ready(function() {
    var appContainer = document.querySelector('#applicationContainer');
    appContainer.setAttribute('ui-view', 'page');
    angular.bootstrap(appContainer, [appModule.name], {strictDi: true});
});
