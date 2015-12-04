import angular from 'angular';
import 'angular-mocks';
import applicationComponent from './index';

describe('Application Component', () => {
    beforeEach(angular.mock.module(applicationComponent.name));

    it('should pass the dummy test to verify the karma setup', () => {
        expect(true).toEqual(true);
    });
});
