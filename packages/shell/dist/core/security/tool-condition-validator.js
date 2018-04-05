var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'rxjs';
import { PowerShell } from '../data/powershell';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { EnvironmentModule, EnvironmentModuleToolState } from '../manifest/environment-modules';
import { GatewayMode } from '../shared/gateway-inventory/gateway-inventory';
/**
 * The class handles conditions of tools to be presented on tools' menu.
 */
var ToolConditionValidator = /** @class */ (function () {
    /**
     * Initializes a new instance of the ToolConditionValidator class.
     * @param caches the instance of the inventory query caches to share the resource.
     */
    function ToolConditionValidator(caches) {
        this.caches = caches;
    }
    /**
     * Gets the current object of the ToolConditionValidator class, and maintains as singleton.
     *
     * @param caches the instance of the inventory query caches to share the resource.
     */
    ToolConditionValidator.current = function (caches) {
        if (!ToolConditionValidator.internalCurrent) {
            ToolConditionValidator.internalCurrent = new ToolConditionValidator(caches);
        }
        return ToolConditionValidator.internalCurrent;
    };
    /**
     * Scan the tool condition to be present or not.
     * @param connection the connection object.
     * @param solution The entry point object of solution.
     * @param tool The entry point object of tool.
     * @param scanMode The mode of scanning.
     * @return {Observable} the result observable.
     */
    ToolConditionValidator.prototype.scanToolCondition = function (connection, solution, tool) {
        var _this = this;
        if (!tool.requirements) {
            // tool is missing requirements, never show.
            return __assign({}, tool, {
                show: false,
                detail: EnvironmentModuleToolState.NotSupported
            });
        }
        var solutionId = EnvironmentModule.createFormattedEntrypoint(solution);
        var toolId = EnvironmentModule.createFormattedEntrypoint(tool);
        var checkersCollection = [];
        for (var _i = 0, _a = tool.requirements; _i < _a.length; _i++) {
            var requirement = _a[_i];
            if (requirement.solutionIds
                && requirement.connectionTypes
                && requirement.solutionIds.some(function (id) { return id === solutionId; })
                && requirement.connectionTypes.some(function (type) { return type === connection.type; })) {
                if (!requirement.conditions || requirement.conditions.length === 0) {
                    return __assign({}, tool, {
                        show: true,
                        detail: EnvironmentModuleToolState.Available
                    });
                }
                var checkers = [];
                for (var _b = 0, _c = requirement.conditions; _b < _c.length; _b++) {
                    var condition = _c[_b];
                    if (condition.localhost !== undefined && !condition.localhost) {
                        // if connection is localhost and not supported.
                        checkers.push(this.localhostValidate(connection));
                    }
                    if (condition.inventory) {
                        checkers.push(this.inventoryValidate(connection, condition.inventory));
                    }
                    if (condition.powerShell) {
                        // powerShell { command, script }
                        checkers.push(this.toolInventoryValidate(connection, toolId, condition.powerShell));
                    }
                    else if (condition.script) {
                        // deprecated
                        checkers.push(this.toolInventoryValidate(connection, toolId, condition.script));
                    }
                }
                if (checkers.length === 0) {
                    return __assign({}, tool, {
                        show: true,
                        detail: EnvironmentModuleToolState.Available
                    });
                }
                checkersCollection.push(checkers);
            }
        }
        if (checkersCollection.length === 0) {
            return __assign({}, tool, {
                show: false,
                detail: EnvironmentModuleToolState.NotSupported
            });
        }
        var collectionIndex = 0;
        var checkerIndex = 0;
        var lastDetail = null;
        var lastMessage = null;
        return this.runChecker(checkersCollection[collectionIndex][checkerIndex])
            .catch(function (error, caught) {
            Logging.log({
                level: LogLevel.Error,
                message: MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ToolValidationResult.message.format(tool.parentModule.name, tool.displayName),
                source: 'ToolConditionValidator'
            });
            return Observable.of({
                show: false,
                ends: true
            });
        })
            .expand(function (value, index) {
            checkerIndex++;
            if (value.ends) {
                return Observable.empty();
            }
            if (value.detail !== undefined && lastDetail == null) {
                lastDetail = value.detail;
            }
            if (value.message !== undefined && lastMessage == null) {
                lastMessage = value.message;
            }
            if (!value.show) {
                // failed result. increment collection index and reset checkerIndex.
                if (checkersCollection.length > ++collectionIndex) {
                    // still has another condition, try next checker set.
                    return _this.runChecker(checkersCollection[collectionIndex][checkerIndex = 0]);
                }
                else {
                    // no more condition, end to return 'false'.
                    return Observable.of({
                        show: false,
                        detail: lastDetail,
                        message: lastMessage,
                        ends: true
                    });
                }
            }
            if (checkersCollection[collectionIndex].length > checkerIndex) {
                // check next checker.
                return _this.runChecker(checkersCollection[collectionIndex][checkerIndex]);
            }
            else {
                // all state/succeeded within the checker set.
                return Observable.of({
                    show: true,
                    detail: lastDetail,
                    message: lastMessage,
                    ends: true
                });
            }
        })
            .filter(function (combined) { return combined.ends; })
            .map(function (combined) {
            return __assign({}, tool, {
                show: combined.show,
                detail: combined.detail,
                message: combined.message
            });
        });
    };
    ToolConditionValidator.prototype.runChecker = function (checker) {
        return checker.take(1).map(function (result) { return (__assign({}, result, { ends: false })); });
    };
    ToolConditionValidator.prototype.localhostValidate = function (connection) {
        return this.caches.gatewayCache.createObservable({})
            .map(function (instance) { return ({
            show: !(instance.mode !== GatewayMode.Service
                && connection.properties
                && connection.properties.displayName === 'localhost')
        }); });
    };
    ToolConditionValidator.prototype.inventoryValidate = function (connection, condition) {
        var _this = this;
        var nodeName = connection.activeAlias ? connection.activeAlias : connection.name;
        return this.caches.serverCache.createObservable({ params: { name: nodeName } })
            .filter(function (instance) { return instance.serverName === nodeName; })
            .map(function (instance) { return ({
            show: _this.checkServerInventoryCondition(condition, instance)
        }); });
    };
    ToolConditionValidator.prototype.toolInventoryValidate = function (connection, id, scriptOrCommand) {
        var command = PowerShell.getPowerShellCommand(scriptOrCommand);
        return this.caches.toolInventoryCache.query(__assign({ name: connection.activeAlias ? connection.activeAlias : connection.name, id: id }, command))
            .map(function (inventory) { return ({
            show: inventory.instance.state === EnvironmentModuleToolState.Available
                || inventory.instance.state === EnvironmentModuleToolState.NotConfigured,
            detail: inventory.instance.state,
            message: inventory.instance.message
        }); });
    };
    ToolConditionValidator.prototype.checkServerInventoryCondition = function (condition, instance) {
        for (var _i = 0, _a = ToolConditionValidator.serverInventoryProperties; _i < _a.length; _i++) {
            var property = _a[_i];
            var conditionItem = condition[property.conditionName];
            if (conditionItem && !this.checkCondition(instance[property.dataName], conditionItem)) {
                return false;
            }
        }
        return true;
    };
    ToolConditionValidator.prototype.checkCondition = function (data, condition) {
        switch (condition.type) {
            case 'number':
                var numberValue = this.getNumberOrZero(data);
                var numberTest = this.getNumberOrZero(condition.value);
                switch (condition.operator) {
                    case ToolConditionValidator.operators.gt:
                        return numberValue > numberTest;
                    case ToolConditionValidator.operators.ge:
                        return numberValue >= numberTest;
                    case ToolConditionValidator.operators.lt:
                        return numberValue < numberTest;
                    case ToolConditionValidator.operators.le:
                        return numberValue <= numberTest;
                    case ToolConditionValidator.operators.eq:
                        return numberValue === numberTest;
                    case ToolConditionValidator.operators.ne:
                        return numberValue !== numberTest;
                    case ToolConditionValidator.operators.is:
                        return !!numberValue;
                    case ToolConditionValidator.operators.not:
                        return !numberValue;
                    default:
                        throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ToolValidationUnsupportedOperator.message);
                }
            case 'string':
                var stringValue = '' + data;
                var stringTest = '' + condition.value;
                switch (condition.operator) {
                    case ToolConditionValidator.operators.gt:
                        return stringValue.toLowerCase() > stringTest.toLowerCase();
                    case ToolConditionValidator.operators.ge:
                        return stringValue.toLowerCase() >= stringTest.toLowerCase();
                    case ToolConditionValidator.operators.lt:
                        return stringValue.toLowerCase() < stringTest.toLowerCase();
                    case ToolConditionValidator.operators.le:
                        return stringValue.toLowerCase() <= stringTest.toLowerCase();
                    case ToolConditionValidator.operators.eq:
                        return stringValue.toLowerCase() === stringTest.toLowerCase();
                    case ToolConditionValidator.operators.ne:
                        return stringValue.toLowerCase() !== stringTest.toLowerCase();
                    case ToolConditionValidator.operators.is:
                        return !!data;
                    case ToolConditionValidator.operators.not:
                        return !data;
                    case ToolConditionValidator.operators.contains:
                        return stringValue.toLowerCase().indexOf(stringTest.toLowerCase()) >= 0;
                    case ToolConditionValidator.operators.notContains:
                        return stringValue.toLowerCase().indexOf(stringTest.toLowerCase()) < 0;
                    default:
                        throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ToolValidationUnsupportedOperator.message);
                }
            case 'boolean':
                switch (condition.operator) {
                    case ToolConditionValidator.operators.is:
                        return !!data;
                    case ToolConditionValidator.operators.not:
                        return !data;
                    default:
                        throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ToolValidationUnsupportedOperator.message);
                }
            case 'version':
                var versionValue = data;
                var versionTest = condition.value;
                return this.compareVersion(versionValue, versionTest, condition.operator);
            default:
                throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ToolValidationUnsupportedDataType.message);
        }
    };
    ToolConditionValidator.prototype.compareVersion = function (left, right, operator) {
        var leftSegments = left.split('.');
        var rightSegments = right.split('.');
        if (!leftSegments || leftSegments.length <= 0 || !rightSegments || rightSegments.length <= 0) {
            throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ToolValidationVersionFormat.message);
        }
        var count = Math.max(leftSegments.length, rightSegments.length);
        var status;
        for (var index = 0; index < count; index++) {
            if (rightSegments[index] === '*') {
                // quit comparison with wildcard.
                status = 0;
                break;
            }
            var leftSegment = this.getNumberOrZero(leftSegments[index]);
            var rightSegment = this.getNumberOrZero(rightSegments[index]);
            if (leftSegment === rightSegment) {
                // equal.
                status = 0;
            }
            else if (leftSegment > rightSegment) {
                // greater.
                status = 1;
                break;
            }
            else {
                // lesser.
                status = -1;
                break;
            }
        }
        switch (operator) {
            case ToolConditionValidator.operators.gt:
                return status > 0;
            case ToolConditionValidator.operators.ge:
                return status >= 0;
            case ToolConditionValidator.operators.lt:
                return status < 0;
            case ToolConditionValidator.operators.le:
                return status <= 0;
            case ToolConditionValidator.operators.eq:
                return status === 0;
            case ToolConditionValidator.operators.ne:
                return status !== 0;
            default:
                throw new Error(MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ToolValidationUnsupportedOperator.message);
        }
    };
    ToolConditionValidator.prototype.getNumberOrZero = function (data) {
        var result = Number(data);
        return isNaN(result) ? 0 : result;
    };
    /**
     * Support the following condition name.
     * It can be a string, number, boolean and version string.
     */
    ToolConditionValidator.serverInventoryProperties = [
        // string
        {
            conditionName: 'computerManufacturer',
            dataName: 'computerManufacturer'
        },
        // number
        {
            conditionName: 'operatingSystemSKU',
            dataName: 'operatingSystemSKU'
        },
        // version string
        {
            conditionName: 'operatingSystemVersion',
            dataName: 'operatingSystemVersion'
        },
        // number
        {
            conditionName: 'windowsProductType',
            dataName: 'productType'
        },
        // string
        {
            conditionName: 'clusterFqdn',
            dataName: 'clusterFqdn'
        },
        // boolean
        {
            conditionName: 'isHyperVRoleInstalled',
            dataName: 'isHyperVRoleInstalled'
        },
        // boolean
        {
            conditionName: 'isHyperVPowershellInstalled',
            dataName: 'isHyperVPowershellInstalled'
        },
        // boolean
        {
            conditionName: 'isManagementToolsAvailable',
            dataName: 'isManagementToolsAvailable'
        },
        // boolean
        {
            conditionName: 'isWmfInstalled',
            dataName: 'isWmfInstalled'
        }
    ];
    /**
     * The following operators are supported.
     */
    ToolConditionValidator.operators = {
        gt: 'gt',
        ge: 'ge',
        lt: 'lt',
        le: 'le',
        eq: 'eq',
        ne: 'ne',
        is: 'is',
        not: 'not',
        contains: 'contains',
        notContains: 'notContains'
    };
    return ToolConditionValidator;
}());
export { ToolConditionValidator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2VjdXJpdHkvdG9vbC1jb25kaXRpb24tdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUdsQyxPQUFPLEVBQUUsVUFBVSxFQUFxQixNQUFNLG9CQUFvQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDakQsT0FBTyxFQUNILGlCQUFpQixFQU1qQiwwQkFBMEIsRUFDN0IsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQW9CLFdBQVcsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBZTlGOztHQUVHO0FBQ0g7SUErRkk7OztPQUdHO0lBQ0gsZ0NBQVksTUFBNEI7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQW5CRDs7OztPQUlHO0lBQ1csOEJBQU8sR0FBckIsVUFBc0IsTUFBNEI7UUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzFDLHNCQUFzQixDQUFDLGVBQWUsR0FBRyxJQUFJLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFFRCxNQUFNLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDO0lBQ2xELENBQUM7SUFVRDs7Ozs7OztPQU9HO0lBQ0ksa0RBQWlCLEdBQXhCLFVBQ1EsVUFBc0IsRUFDdEIsUUFBcUMsRUFDckMsSUFBaUM7UUFIekMsaUJBc0pDO1FBakpHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDckIsNENBQTRDO1lBQzVDLE1BQU0sY0FDQyxJQUFJLEVBQ2tDO2dCQUNyQyxJQUFJLEVBQUUsS0FBSztnQkFDWCxNQUFNLEVB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SyxDQUFDLGlDQUFpQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ILENBQUM7SUFDTCxDQUFDO0lBRU8sZ0RBQWUsR0FBdkIsVUFBd0IsSUFBUztRQUM3QixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdEMsQ0FBQztJQTdiRDs7O09BR0c7SUFDWSxnREFBeUIsR0FBa0Q7UUFDdEYsU0FBUztRQUNUO1lBQ0ksYUFBYSxFQUFFLHNCQUFzQjtZQUNyQyxRQUFRLEVBQUUsc0JBQXNCO1NBQ25DO1FBRUQsU0FBUztRQUNUO1lBQ0ksYUFBYSxFQUFFLG9CQUFvQjtZQUNuQyxRQUFRLEVBQUUsb0JBQW9CO1NBQ2pDO1FBRUQsaUJBQWlCO1FBQ2pCO1lBQ0ksYUFBYSxFQUFFLHdCQUF3QjtZQUN2QyxRQUFRLEVBQUUsd0JBQXdCO1NBQ3JDO1FBRUQsU0FBUztRQUNUO1lBQ0ksYUFBYSxFQUFFLG9CQUFvQjtZQUNuQyxRQUFRLEVBQUUsYUFBYTtTQUMxQjtRQUVELFNBQVM7UUFDVDtZQUNJLGFBQWEsRUFBRSxhQUFhO1lBQzVCLFFBQVEsRUFBRSxhQUFhO1NBQzFCO1FBRUQsVUFBVTtRQUNWO1lBQ0ksYUFBYSxFQUFFLHVCQUF1QjtZQUN0QyxRQUFRLEVBQUUsdUJBQXVCO1NBQ3BDO1FBRUQsVUFBVTtRQUNWO1lBQ0ksYUFBYSxFQUFFLDZCQUE2QjtZQUM1QyxRQUFRLEVBQUUsNkJBQTZCO1NBQzFDO1FBRUQsVUFBVTtRQUNWO1lBQ0ksYUFBYSxFQUFFLDRCQUE0QjtZQUMzQyxRQUFRLEVBQUUsNEJBQTRCO1NBQ3pDO1FBRUQsVUFBVTtRQUNWO1lBQ0ksYUFBYSxFQUFFLGdCQUFnQjtZQUMvQixRQUFRLEVBQUUsZ0JBQWdCO1NBQzdCO0tBQ0osQ0FBQztJQUVGOztPQUVHO0lBQ1ksZ0NBQVMsR0FBRztRQUN2QixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEdBQUcsRUFBRSxLQUFLO1FBQ1YsUUFBUSxFQUFFLFVBQVU7UUFDcEIsV0FBVyxFQUFFLGFBQWE7S0FDN0IsQ0FBQztJQW9YTiw2QkFBQztDQS9iRCxBQStiQyxJQUFBO1NBL2JZLHNCQUFzQiIsImZpbGUiOiJ0b29sLWNvbmRpdGlvbi12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9