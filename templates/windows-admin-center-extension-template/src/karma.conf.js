// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../unittests/app/coverage'),
            reports: ['lcovonly'],
            fixWebpackSourcePaths: true,
            thresholds: {
                // 80 percent code coverage would be much more ideal.
                statements: 0,
                lines: 0,
                branches: 0,
                functions: 0
            }
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO, // config.LOG_DEBUG,
        autoWatch: true,
        browsers: ['ChromeHeadlessNS'],
        singleRun: true,
        customLaunchers: {
            ChromeHeadlessNS: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu']
            },
            ChromeNS: {
                base: 'Chrome',
                flags: ['--no-sandbox', '--disable-gpu']
            }
        }
    });
};