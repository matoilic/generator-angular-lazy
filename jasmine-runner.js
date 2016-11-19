const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter');

const runner = new Jasmine();
runner.configureDefaultReporter({ print: () => {} });
runner.env.clearReporters();
runner.addReporter(new SpecReporter());
runner.loadConfigFile();
runner.execute();
