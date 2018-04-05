import { Observable } from 'rxjs';
import { VersionedObject } from '../base/versioned-object';
import { RpcSettingsOperationType, RpcSettingsProviderType, RpcSettingsScope } from '../rpc/rpc-base';
/**
 * Manager for the settings. Provides an api for managing user and application settings.
 */
var SettingsManager = /** @class */ (function () {
    /**
     * Initializes a new instance of the SettingsManager class.
     *
     * @param rpc the RPC class instance.
     */
    function SettingsManager(rpc) {
        this.rpc = rpc;
    }
    /**
     * Get common user settings. This is currently read-only
     */
    SettingsManager.prototype.getCommonUserSettings = function () {
        return Observable
            .fromPromise(this.rpc.settings({
            operation: RpcSettingsOperationType.Get,
            scope: RpcSettingsScope.User,
            provider: RpcSettingsProviderType.Common
        }))
            .map(function (value) { return value.data; });
    };
    /**
     * Get common application settings. This is currently read-only
     */
    SettingsManager.prototype.getCommonApplicationSettings = function () {
        return Observable
            .fromPromise(this.rpc.settings({
            operation: RpcSettingsOperationType.Get,
            scope: RpcSettingsScope.Application,
            provider: RpcSettingsProviderType.Common
        }))
            .map(function (value) { return value.data; });
    };
    /**
     * Get extension user settings
     * Extension settings objects must be an object that extends VersionedObject or implements the VersionedObjectConstructor
     * example: if TestObject extends VersionedObject, then getExtensionSettings(TestObject) will return an Observable<TestObject>
     * you should only create 1 versioned object for your extensions user settings.
     */
    SettingsManager.prototype.getExtensionUserSettings = function (type) {
        var _this = this;
        return Observable.fromPromise(this.rpc.settings({
            operation: RpcSettingsOperationType.Get,
            scope: RpcSettingsScope.User,
            provider: RpcSettingsProviderType.Extension
        })).map(function (response) {
            // If the extension settings are not versioned (or not defined), then start with an empty settings.
            var settings = VersionedObject.ensureIsVersionedObject(response.data);
            return new type(settings, {
                save: function (object) {
                    return Observable.fromPromise(_this.rpc.settings({
                        operation: RpcSettingsOperationType.Set,
                        scope: RpcSettingsScope.User,
                        provider: RpcSettingsProviderType.Extension,
                        value: object
                    }));
                }
            });
        });
    };
    /**
     * Get extension application settings
     * Extension settings objects must be an object that extends VersionedObject or implements the VersionedObjectConstructor
     * example: if TestObject extends VersionedObject, then getExtensionSettings(TestObject) will return an Observable<TestObject>
     * you should only create 1 versioned object for your extensions application settings.
     */
    SettingsManager.prototype.getExtensionApplicationSettings = function (type) {
        var _this = this;
        return Observable.fromPromise(this.rpc.settings({
            operation: RpcSettingsOperationType.Get,
            scope: RpcSettingsScope.Application,
            provider: RpcSettingsProviderType.Extension
        })).map(function (response) {
            // If the extension settings are not versioned (or not defined), then start with an empty settings.
            var settings = VersionedObject.ensureIsVersionedObject(response.data);
            return new type(settings, {
                save: function (object) {
                    return Observable.fromPromise(_this.rpc.settings({
                        operation: RpcSettingsOperationType.Set,
                        scope: RpcSettingsScope.Application,
                        provider: RpcSettingsProviderType.Extension,
                        value: object
                    }));
                }
            });
        });
    };
    return SettingsManager;
}());
export { SettingsManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9zZXR0aW5ncy1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBNkIsVUFBVSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUU1RSxPQUFPLEVBQXdCLGVBQWUsRUFBOEIsTUFBTSwwQkFBMEIsQ0FBQztBQUU3RyxPQUFPLEVBQWUsd0JBQXdCLEVBQUUsdUJBQXVCLEVBQXFCLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFtQnRJOztHQUVHO0FBQ0g7SUFFSTs7OztPQUlHO0lBQ0gseUJBQW9CLEdBQVE7UUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO0lBQUksQ0FBQztJQUVqQzs7T0FFRztJQUNJLCtDQUFxQixHQUE1QjtRQUNJLE1BQU0sQ0FBQyxVQUFVO2FBQ1osV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFjO1lBQ3hDLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQyxHQUFHO1lBQ3ZDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJO1lBQzVCLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1NBQzNDLENBQUMsQ0FBQzthQUNGLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLEVBQVYsQ0FBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksc0RBQTRCLEdBQW5DO1FBQ0ksTUFBTSxDQUFDLFVBQVU7YUFDWixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQWM7WUFDeEMsU0FBUyxFQUFFLHdCQUF3QixDQUFDLEdBQUc7WUFDdkMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVc7WUFDbkMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLE1BQU07U0FDM0MsQ0FBQyxDQUFDO2FBQ0YsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLElBQUksRUFBVixDQUFVLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxrREFBd0IsR0FBL0IsVUFBMkQsSUFBbUM7UUFBOUYsaUJBbUJDO1FBbEJHLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFjO1lBQ3pELFNBQVMsRUFBRSx3QkFBd0IsQ0FBQyxHQUFHO1lBQ3ZDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJO1lBQzVCLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxTQUFTO1NBQzlDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7WUFDWixtR0FBbUc7WUFDbkcsSUFBSSxRQUFRLEdBQUcsZUFBZSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN0QixJQUFJLEVBQUUsVUFBQyxNQUFNO29CQUNULE1BQU0sQ0FBa0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBYzt3QkFDMUUsU0FBUyxFQUFFLHdCQUF3QixDQUFDLEdBQUc7d0JBQ3ZDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJO3dCQUM1QixRQUFRLEVBQUUsdUJBQXVCLENBQUMsU0FBUzt3QkFDM0MsS0FBSyxFQUFFLE1BQU07cUJBQ2hCLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUM7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLHlEQUErQixHQUF0QyxVQUFrRSxJQUFtQztRQUFyRyxpQkFtQkM7UUFsQkcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQWM7WUFDekQsU0FBUyxFQUFFLHdCQUF3QixDQUFDLEdBQUc7WUFDdkMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVc7WUFDbkMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLFNBQVM7U0FDOUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTtZQUNaLG1HQUFtRztZQUNuRyxJQUFJLFFBQVEsR0FBRyxlQUFlLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RCLElBQUksRUFBRSxVQUFDLE1BQU07b0JBQ1QsTUFBTSxDQUFrQixVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFjO3dCQUMxRSxTQUFTLEVBQUUsd0JBQXdCLENBQUMsR0FBRzt3QkFDdkMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVc7d0JBQ25DLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxTQUFTO3dCQUMzQyxLQUFLLEVBQUUsTUFBTTtxQkFDaEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsQ0FBQzthQUNKLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0F4RkEsQUF3RkMsSUFBQSIsImZpbGUiOiJzZXR0aW5ncy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==