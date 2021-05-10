import 'zone.js/dist/zone-testing';

import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { MsftSmeMock } from '@msft-sme/core/base/msft-sme.mock';
import { ConsoleMock } from '@msft-sme/core/test-utilities/console.mock';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {
    // loaded event handler for karma
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

// Solution of 'Uncaught Error: Unable to access localized ResourcesString' error
const strings = require('./assets/strings/strings.json');
MsftSme.self().Resources = <MsftSme.MsftSmeResources>{ strings: strings.Strings };

// Setup our mocks before all the tests run.
beforeAll(() => {
    MsftSmeMock.mockStrings(strings);
    MsftSmeMock.mockSelf();
    ConsoleMock.mockConsole();
});

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
