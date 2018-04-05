import { Input } from '@angular/core';
/**
 * Base class for template loaders
 */
var TemplateLoaderBaseComponent = /** @class */ (function () {
    /**
     * Instantiates a new instance of TemplateLoaderBaseComponent
     * @param viewContainer the reference to this elements view container
     */
    function TemplateLoaderBaseComponent(viewContainer) {
        this.viewContainer = viewContainer;
    }
    /**
     * Implementation of angular OnInit interface
     */
    TemplateLoaderBaseComponent.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.template, this.createContext());
    };
    /**
     * Implementation of angular OnChanges interface
     * @param changes the changes that occured
     */
    TemplateLoaderBaseComponent.prototype.ngOnChanges = function (changes) {
        if (!this.view || !this.view.context) {
            return;
        }
        // changes and update the context if those properties exist 
        for (var key in changes) {
            if (key in this.view.context) {
                this.view.context[key] = changes[key].currentValue;
            }
        }
    };
    /**
     * Implementation of angular OnDestroy interface
     */
    TemplateLoaderBaseComponent.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    TemplateLoaderBaseComponent.propDecorators = {
        'data': [{ type: Input },],
        'template': [{ type: Input },],
    };
    return TemplateLoaderBaseComponent;
}());
export { TemplateLoaderBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvY29udHJvbHMvY29tbW9uL3RlbXBsYXRlLWxvYWRlci1iYXNlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQW1CLEtBQUEsRUFBbUUsTUFBTyxlQUFBLENBQWdCO0FBS3BIOztHQUVHO0FBQ0g7SUFtQkk7OztPQUdHO0lBQ0gscUNBQW9CLGFBQStCO1FBQS9CLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtJQUNuRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw4Q0FBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGlEQUFXLEdBQWxCLFVBQW1CLE9BQU87UUFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCw0REFBNEQ7UUFDNUQsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQ3ZELENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksaURBQVcsR0FBbEI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFNRSwwQ0FBYyxHQUEyQztRQUNoRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMxQixVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtLQUM3QixDQUFDO0lBQ0Ysa0NBQUM7Q0FqRUQsQUFpRUMsSUFBQTtTQWpFcUIsMkJBQTJCIiwiZmlsZSI6InRlbXBsYXRlLWxvYWRlci1iYXNlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=