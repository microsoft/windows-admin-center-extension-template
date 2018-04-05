import { Injectable } from '@angular/core';
import { AppContextService } from '../../../../../angular';
import { Net } from '../../../../../core';
import { QueryCache } from '../../../../../core';
var AccessService = /** @class */ (function () {
    function AccessService(appContextService) {
        var _this = this;
        this.appContextService = appContextService;
        this.usersQueryCache = new QueryCache(function (params) { return _this.getUsersSecurityGroups(); }, function (params) { return ''; });
        this.adminsQueryCache = new QueryCache(function (params) { return _this.getAdminsSecurityGroups(); }, function (params) { return ''; });
    }
    AccessService.prototype.addSecurityGroup = function (name, type, section) {
        var encodedName = Net.utf8Base64UrlEncode(name);
        // Build request url in the format: access/users/name/type/type 
        var requestUrl = 'gateway/access/{0}/{1}/type/{2}'.format(section, encodedName, type);
        return this.appContextService.gateway.put(requestUrl);
    };
    AccessService.prototype.deleteSecurityGroup = function (name, type, section) {
        var encodedName = Net.utf8Base64UrlEncode(name);
        // Build request url in the format: access/users/name/type/type 
        var requestUrl = 'gateway/access/{0}/{1}/type/{2}'.format(section, encodedName, type);
        return this.appContextService.gateway.delete(requestUrl);
    };
    AccessService.prototype.enableAadAuthentication = function () {
        return this.appContextService.gateway.post('gateway/aad/enableAadAuth');
    };
    AccessService.prototype.disableAadAuthentication = function () {
        return this.appContextService.gateway.post('gateway/aad/disableAadAuth');
    };
    AccessService.prototype.getAzureApplicationInfo = function () {
        return this.appContextService.gateway.get('gateway/aad/appInfo').map(function (res) {
            return res;
        });
    };
    AccessService.prototype.getUsersSecurityGroups = function () {
        return this.appContextService.gateway.get('gateway/access/users').map(function (res) {
            return res;
        });
    };
    AccessService.prototype.getAdminsSecurityGroups = function () {
        return this.appContextService.gateway.get('gateway/access/admins').map(function (res) {
            return res;
        });
    };
    AccessService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AccessService.ctorParameters = function () { return [
        { type: AppContextService, },
    ]; };
    return AccessService;
}());
export { AccessService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvbmZpZ3VyYXRpb24vcGFuZWxzL2FjY2Vzcy9hY2Nlc3Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBQSxFQUFXLE1BQU8sZUFBQSxDQUFnQjtBQUczQyxPQUFPLEVBQUUsaUJBQUEsRUFBa0IsTUFBTyx3QkFBQSxDQUF5QjtBQUMzRCxPQUFPLEVBQUUsR0FBQSxFQUFJLE1BQU8scUJBQUEsQ0FBc0I7QUFDMUMsT0FBTyxFQUFFLFVBQUEsRUFBVyxNQUFPLHFCQUFBLENBQXNCO0FBSWpEO0lBS0ksdUJBQW9CLGlCQUFvQztRQUF4RCxpQkFDQztRQURtQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBSGpELG9CQUFlLEdBQUcsSUFBSSxVQUFVLENBQVUsVUFBQSxNQUFNLElBQUksT0FBQSxLQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBN0IsQ0FBNkIsRUFBRSxVQUFBLE1BQU0sSUFBSSxPQUFBLEVBQUUsRUFBRixDQUFFLENBQUMsQ0FBQztRQUNqRyxxQkFBZ0IsR0FBRyxJQUFJLFVBQVUsQ0FBVSxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyx1QkFBdUIsRUFBRSxFQUE5QixDQUE4QixFQUFFLFVBQUEsTUFBTSxJQUFJLE9BQUEsRUFBRSxFQUFGLENBQUUsQ0FBQyxDQUFDO0lBRzFHLENBQUM7SUFFTSx3Q0FBZ0IsR0FBdkIsVUFBd0IsSUFBWSxFQUFFLElBQVksRUFBRSxPQUFlO1FBQy9ELElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsRCxnRUFBZ0U7UUFDaEUsSUFBTSxVQUFVLEdBQUcsaUNBQWlDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEYsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSwyQ0FBbUIsR0FBMUIsVUFBMkIsSUFBWSxFQUFFLElBQVksRUFBRSxPQUFlO1FBQ2xFLElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsRCxnRUFBZ0U7UUFDaEUsSUFBTSxVQUFVLEdBQUcsaUNBQWlDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEYsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTSwrQ0FBdUIsR0FBOUI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRU0sZ0RBQXdCLEdBQS9CO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVNLCtDQUF1QixHQUE5QjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFBLEdBQUc7WUFDckUsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVRLDhDQUFzQixHQUE5QjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7WUFDckUsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLCtDQUF1QixHQUEvQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7WUFDdEUsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNFLHdCQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtLQUNuQixDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsNEJBQWMsR0FBbUUsY0FBTSxPQUFBO1FBQzlGLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixHQUFHO0tBQzFCLEVBRjZGLENBRTdGLENBQUM7SUFDRixvQkFBQztDQXhERCxBQXdEQyxJQUFBO1NBeERZLGFBQWEiLCJmaWxlIjoiYWNjZXNzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9