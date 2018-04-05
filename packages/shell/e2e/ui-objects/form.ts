import { WebElement } from 'selenium-webdriver';
import { Utils } from '../utils';
import { UIObject } from './uiObject';

export class Form extends UIObject {
  protected selector = this.selector || 'form';

  public getTextboxByLabel(labelText: string): UIObject {
    return this.getChildUIObject({
      name: 'textbox for ' + labelText, selector: 'input', customSelectorHandler: async (webElement: WebElement) => {
        let formGroup = await Utils.findParentElementAsync(webElement, '', 'sme-form-field');
        let children = await Utils.findDirectChildrenAsync(formGroup);
        let result = false;
        for (let i = 0; i < children.length; i++) {
          let text = await Utils.getTextAsync(children[i]);
          if (text === labelText) {
            result = true;
            break;
          }
        }

        return result;
      }
    });
  }
}