import angular from 'angular';
import 'angular-mocks';
import component from './index';

describe('<%= _.titleize(_.humanize(componentName)) %>', () => {
    beforeEach(angular.mock.module(component.name));

    it('should pass the dummy test to verify the karma setup', () => {
        expect(true).toEqual(true);
    });
});
