import { Component } from '@angular/core';
var TooltipExampleComponent = /** @class */ (function () {
    function TooltipExampleComponent() {
    }
    TooltipExampleComponent.navigationTitle = function (appContextService, snapshot) {
        return 'smeTooltip';
    };
    TooltipExampleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sme-ng2-controls-tooltip-example',
                    template: "\n      <div class=\"sme-layout-absolute sme-position-inset-none sme-documentation\">\n          <h1>Tooltip</h1>\n          <p>\n              The tooltip directives work in conjunction with the <code>sme-tooltip-host</code> component. This component should be generally use in the root component of your project after all of your application content.\n          </p>\n          <code>... application content ...\n      &lt;sme-tooltip-host&gt;&lt;/sme-tooltip-host&gt;</code>\n\n          <h2>Title Example</h2>\n          <section>\n              <p>\n                  The tooltip directive automatically applies itself when you use the standard <code>[title]</code> attribute. Not that if the attribute is not bound with '[]' the native tooltip may still appear in addition to the styled one. If you want to\n                  use only the native tooltip, then bind to <code>[attr.title]</code> instead.\n              </p>\n              <div class=\"sme-documentation-example\">\n                  <button [title]=\"'This is a tooltip'\">Hover Over Me</button>\n              </div>\n              <code>&lt;button [title]=\"'This is a tooltip'\"&gt;Hover Over Me&lt;/button&gt;</code>\n          </section>\n\n\n          <h2>Custom Example</h2>\n          <section>\n              <p>\n                  Tooltips can have custom content as well using the <code>smeTooltip</code> and <code>smeTooltipContext</code> attribute instead.\n              </p>\n              <div class=\"sme-documentation-example\">\n                  <button [smeTooltip]=\"template\" [smeTooltipContext]=\"{ linkText: 'Microsoft Bing', link: 'www.bing.com' }\">Hover Over Me</button>\n                  <ng-template #template let-data>\n                      This is a custom tooltip. It even has a link to <a class=\"sme-link\" target=\"about:blank\" [href]=\"data.link\">{{data.linkText}}</a>\n                  </ng-template>\n              </div>\n              <code>&lt;button [smeTooltip]=\"template\" [smeTooltipContext]=\"{{'{'}} linkText: 'Microsoft Bing', link: 'www.bing.com' }\"&gt;Hover Over Me&lt;/button&gt;\n      &lt;ng-template #template let-data&gt;\n          &lt;p&gt;\n              This is a custom tooltip. It even has a link to &lt;a class=\"sme-link\" target=\"about:blank\" [href]=\"data.link\"&gt;{{'{'}}{{'{'}}data.linkText}}&lt;/a&gt;\n          &lt;/p&gt;\n      &lt;/ng-template&gt;</code>\n          </section>\n\n\n      </div>\n    "
                },] },
    ];
    /** @nocollapse */
    TooltipExampleComponent.ctorParameters = function () { return []; };
    return TooltipExampleComponent;
}());
export { TooltipExampleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9kZXYtZ3VpZGUvbW9kdWxlcy9jb250cm9scy90b29sdGlwL3Rvb2x0aXAtZXhhbXBsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBNkIsTUFBTyxlQUFBLENBQWdCO0FBSzdEO0lBQUE7SUF3REEsQ0FBQztJQXZEaUIsdUNBQWUsR0FBN0IsVUFBOEIsaUJBQW9DLEVBQUUsUUFBZ0M7UUFDaEcsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBQ0Usa0NBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN0QixRQUFRLEVBQUUsa0NBQWtDO29CQUM1QyxRQUFRLEVBQUUsMDVFQTJDVDtpQkFDSixFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsc0NBQWMsR0FBbUUsY0FBTSxPQUFBLEVBQzdGLEVBRDZGLENBQzdGLENBQUM7SUFDRiw4QkFBQztDQXhERCxBQXdEQyxJQUFBO1NBeERZLHVCQUF1QiIsImZpbGUiOiJ0b29sdGlwLWV4YW1wbGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==