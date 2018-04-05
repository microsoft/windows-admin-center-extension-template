var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Injectable } from '@angular/core';
import { CimStream } from '../../core';
import { AuthorizationService } from './authorization.service';
import { PowerShellStreamService } from './powershell-stream.service';
import { WebsocketStreamService } from './websocket-stream.service';
/**
 * The CIM Stream service class.
 */
var CimStreamService = /** @class */ (function (_super) {
    __extends(CimStreamService, _super);
    /**
     * Initializes a new instance of the CimStreamService class.
     *
     * @param websocketStreamService the websocket stream class instance injected.
     * @param powerShellStream the PowerShell stream class instance injected.
     * @param authorizationService the authorization manager service class instance injected.
     */
    function CimStreamService(websocketStreamService, powerShellStream, authorizationService) {
        return _super.call(this, websocketStreamService, powerShellStream, authorizationService) || this;
    }
    CimStreamService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CimStreamService.ctorParameters = function () { return [
        { type: WebsocketStreamService, },
        { type: PowerShellStreamService, },
        { type: AuthorizationService, },
    ]; };
    return CimStreamService;
}(CimStream));
export { CimStreamService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvc2VydmljZS9jaW0tc3RyZWFtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFBLEVBQVcsTUFBTyxlQUFBLENBQWdCO0FBQzNDLE9BQU8sRUFBRSxTQUFBLEVBQVUsTUFBTyxZQUFBLENBQWE7QUFDdkMsT0FBTyxFQUFFLG9CQUFBLEVBQXFCLE1BQU8seUJBQUEsQ0FBMEI7QUFDL0QsT0FBTyxFQUFFLHVCQUFBLEVBQXdCLE1BQU8sNkJBQUEsQ0FBOEI7QUFDdEUsT0FBTyxFQUFFLHNCQUFBLEVBQXVCLE1BQU8sNEJBQUEsQ0FBNkI7QUFHcEU7O0dBRUc7QUFDSDtJQUFzQyxvQ0FBUztJQUMzQzs7Ozs7O09BTUc7SUFDSCwwQkFDSSxzQkFBOEMsRUFDN0MsZ0JBQXlDLEVBQ3pDLG9CQUEwQztlQUMzQyxrQkFBTSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQztJQUN6RSxDQUFDO0lBQ0UsMkJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0tBQ25CLENBQUM7SUFDRixrQkFBa0I7SUFDWCwrQkFBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsc0JBQXNCLEdBQUc7UUFDaEMsRUFBQyxJQUFJLEVBQUUsdUJBQXVCLEdBQUc7UUFDakMsRUFBQyxJQUFJLEVBQUUsb0JBQW9CLEdBQUc7S0FDN0IsRUFKNkYsQ0FJN0YsQ0FBQztJQUNGLHVCQUFDO0NBdkJELEFBdUJDLENBdkJxQyxTQUFTLEdBdUI5QztTQXZCWSxnQkFBZ0IiLCJmaWxlIjoiY2ltLXN0cmVhbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==