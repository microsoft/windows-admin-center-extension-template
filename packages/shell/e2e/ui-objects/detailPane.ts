import { WebElement } from 'selenium-webdriver';
import { Utils } from '../utils';
import { UIObject } from './uiObject';

export class DetailPane extends UIObject {
  protected selector = this.selector || 'sme-details';

  public toggle: UIObject = new UIObject(this, { name: 'toggle', selector: '.sme-button' });
  public title: UIObject = new UIObject(this, { name: 'title', selector: '.sme-button h3' });
  public content: UIObject= new UIObject(this, {name: 'content', selector: 'div+div div'});

  public async getDetailByLabelAsync(labelText: string): Promise<string> {
    this.logActionStart('getDetailByLabel', labelText);
    let detail = '';

    let detailLabel = await this.findElementAsync('div+div div label', labelText);
    let detailItemContainer = await Utils.findParentElementAsync(detailLabel, '', 'div');
    let detailContent = await Utils.findElementAsync('div', null, detailItemContainer);
    detail = await Utils.getTextAsync(detailContent);

    this.logActionEnd('getDetailByLabel', detail);
    return detail;
  }
}