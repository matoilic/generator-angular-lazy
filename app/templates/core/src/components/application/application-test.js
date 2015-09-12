describe('Application Component', function() {
    const driver = browser.driver;

    beforeEach(function() {
        driver.get(browser.baseUrl);
        driver.wait(driver.isElementPresent(by.css('ui-view[name="application"]')), 20000);
    });

    afterEach(function () {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    it('should pass the dummy test to verify the protractor setup', function() {
        expect(true).toBe(true);
    });
});
