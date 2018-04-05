let strings = require('../../assets/strings/strings.json');
import { BaseUI, Settings, TestManager, Utils } from '../';
import { DevGuide } from '../ui/devGuide';
import { WebElement } from 'selenium-webdriver';

let testManager = new TestManager<DevGuide>(new DevGuide('Dev Guide'));
testManager.testShell = true;

testManager.testSuite.describe('Dev Guide | alert-bar', () => {
    testManager.testSuite.beforeEach(async () => {
        await testManager.shell.goToSolutionAsync('Dev Guide');
        await testManager.tool.categoryTab.clickByTextAsync('Controls');
        await testManager.tool.controlList.clickByTextAsync('alert-bar');
    });

    testManager.testSuite.it('should be able to handle the basic toast notification', async () => {
        let anonymouseAlertBarTestingDiv=(await testManager.tool.findElementsAsync('.tool-container>div'))[0];
        await Utils.clickByTextAsync(anonymouseAlertBarTestingDiv, 'Simple');
        await testManager.tool.alertBar.waitForAlertByTextAsync('Paragraph lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    });
}, ['servers']);