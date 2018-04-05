var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'rxjs';
import { Cim } from './cim';
import { headerConstants, HttpStatusCode } from './http-constants';
import { NodeCimOutput } from './node-connection';
import { PowerShellAlternate } from './powershell-alternate';
/**
 * The CIM Connection class.
 */
var CimConnection = /** @class */ (function () {
    /**
     * Initializes a new instance of the CimService class.
     *
     * @param nodeConnection the NodeConnection class instance injected.
     * @param batchConnection the BatchConnection class instance injected.
     */
    function CimConnection(nodeConnection, batchConnection) {
        this.nodeConnection = nodeConnection;
        this.batchConnection = batchConnection;
    }
    /**
     * CIM GET MultipleInstances
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.getInstanceMultiple = function (nodeName, namespace, className, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Multiple);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlMultipleInstances(namespace, className);
        return this.nodeConnection.get(nodeName, cimUrl, options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * CIM GET SingleInstance
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param keyProperties the key properties object.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.getInstanceSingle = function (nodeName, namespace, className, keyProperties, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Single, keyProperties);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlSingleInstance(namespace, className, keyProperties);
        return this.nodeConnection.get(nodeName, cimUrl, options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * CIM POST InstanceMethod
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param methodName the method name.
     * @param keyProperties the key properties object.
     * @param data the method input data.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.invokeMethodInstance = function (nodeName, namespace, className, methodName, keyProperties, data, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Result, keyProperties, data && data.parameters);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlInstanceMethod(namespace, className, methodName, keyProperties);
        return this.nodeConnection.post(nodeName, cimUrl, data, options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * CIM POST StaticMethod
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param methodName the method name.
     * @param data the method input data.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.invokeMethodStatic = function (nodeName, namespace, className, methodName, data, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Result, data && data.parameters);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlStaticMethod(namespace, className, methodName);
        return this.nodeConnection.post(nodeName, cimUrl, data, options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * CIM PUT SingleInstance
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param keyProperties the key properties object.
     * @param data the method input data.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.setInstance = function (nodeName, namespace, className, keyProperties, data, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Single, keyProperties, data && data.properties);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlSingleInstance(namespace, className, keyProperties);
        return this.nodeConnection.put(nodeName, cimUrl, data, options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * CIM PATCH SingleInstance
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param keyProperties the key properties object.
     * @param data the method input data.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.modifyInstance = function (nodeName, namespace, className, keyProperties, data, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Single, keyProperties, data && data.properties);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlSingleInstance(namespace, className, keyProperties);
        return this.nodeConnection.patch(nodeName, cimUrl, data, options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * CIM DELETE SingleInstance
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param keyProperties the key properties object.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.deleteInstance = function (nodeName, namespace, className, keyProperties, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Single, keyProperties);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlSingleInstance(namespace, className, keyProperties);
        return this.nodeConnection.delete(nodeName, cimUrl, null, options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * CIM POST WqlQuery
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param query the WQL string.
     * @param options the options for this request.
     * @return Observable<any> the query observable.
     */
    CimConnection.prototype.getInstanceQuery = function (nodeName, namespace, query, options) {
        var _this = this;
        this.setPowerShellParameters(options, NodeCimOutput.Query, options && options.powerShellParameters);
        var observable = PowerShellAlternate.create(this.nodeConnection, nodeName, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlWqlQuery(namespace);
        return this.nodeConnection.post(nodeName, cimUrl, JSON.stringify({ query: query }), options)
            .catch(function (error) { return _this.handleJeaFallback(error, nodeName, options); });
    };
    /**
     * Handle the fallback from CIM to powershell with JEA, if applicable
     * @param error The error to handle
     * @param nodeName The node name
     * @param options The request options
     */
    CimConnection.prototype.handleJeaFallback = function (error, nodeName, options) {
        var _this = this;
        var authError = error.status === HttpStatusCode.Unauthorized;
        var responseEndpoint = error && error.xhr && error.xhr.getResponseHeader(headerConstants.POWERSHELL_ENDPOINT);
        var requestEndpoint = options && options.powerShellEndpoint;
        if (authError && responseEndpoint && requestEndpoint !== responseEndpoint) {
            options.powerShellEndpoint = responseEndpoint;
            var powershellRequest = PowerShellAlternate.create(this.nodeConnection, nodeName, options).do(function () {
                // The JEA request went through - persist this context in authorization manager. 
                _this.nodeConnection.saveJeaContext(nodeName, responseEndpoint);
            });
            return powershellRequest || Observable.throw(error);
        }
        return Observable.throw(error);
    };
    /**********************************
     * Cim Batch Section
     **********************************/
    /**
     * CIM GET MultipleInstances for list of nodes
     *
     * @param nodeNamesList the Nodes to use for this request.
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param options the options for this request.
     * @return Observable<BatchResponseItem[]> the query observable.
     */
    CimConnection.prototype.getBatchInstanceMultiple = function (nodeNamesList, namespace, className, options) {
        this.setPowerShellParameters(options, NodeCimOutput.Multiple);
        var observable = PowerShellAlternate.createBatch(this.nodeConnection, this.batchConnection, nodeNamesList, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlMultipleInstances(namespace, className);
        var urlList = [];
        for (var index = 0; index < nodeNamesList.length; index++) {
            urlList.push(cimUrl);
        }
        return this.batchConnection.get(nodeNamesList, urlList, options);
    };
    /**
     * CIM GET SingleInstance for list of nodes
     *
     * @param nodeNamesList the Nodes to use for this request.
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param keyProperties the key properties object.
     * @param options the options for this request.
     * @return Observable<BatchResponseItem[]> the query observable.
     */
    CimConnection.prototype.getBatchInstanceSingle = function (nodeNamesList, namespace, className, keyProperties, options) {
        this.setPowerShellParameters(options, NodeCimOutput.Single, keyProperties);
        var observable = PowerShellAlternate.createBatch(this.nodeConnection, this.batchConnection, nodeNamesList, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlSingleInstance(namespace, className, keyProperties);
        var urlList = [];
        for (var index = 0; index < nodeNamesList.length; index++) {
            urlList.push(cimUrl);
        }
        return this.batchConnection.get(nodeNamesList, urlList, options);
    };
    /**
     * CIM POST InstanceMethod for list of nodes
     *
     * @param nodeNamesList the Nodes to use for this request.
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param methodName the method name.
     * @param keyProperties the key properties object.
     * @param data the method input data.
     * @param options the options for this request.
     * @return Observable<BatchResponseItem[]> the query observable.
     */
    CimConnection.prototype.invokeBatchMethodInstance = function (nodeNamesList, namespace, className, methodName, keyProperties, data, options) {
        this.setPowerShellParameters(options, NodeCimOutput.Result, keyProperties, data && data.parameters);
        var observable = PowerShellAlternate.createBatch(this.nodeConnection, this.batchConnection, nodeNamesList, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlInstanceMethod(namespace, className, methodName, keyProperties);
        var body = data ? JSON.stringify(data) : null;
        return this.cimBatchPost(nodeNamesList, cimUrl, body, options);
    };
    /**
     * CIM POST StaticMethod for list of nodes
     *
     * @param nodeNamesList the Nodes to use for this request.
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param methodName the method name.
     * @param data the method input data.
     * @param options the options for this request.
     * @return Observable<BatchResponseItem[]> the query observable.
     */
    CimConnection.prototype.invokeBatchMethodStatic = function (nodeNamesList, namespace, className, methodName, data, options) {
        this.setPowerShellParameters(options, NodeCimOutput.Result, data && data.parameters);
        var observable = PowerShellAlternate.createBatch(this.nodeConnection, this.batchConnection, nodeNamesList, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlStaticMethod(namespace, className, methodName);
        var body = data ? JSON.stringify(data) : null;
        return this.cimBatchPost(nodeNamesList, cimUrl, body, options);
    };
    /**
     * CIM PUT SingleInstance for list of nodes
     *
     * @param nodeName the name of the node to use for this request
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param keyProperties the key properties object.
     * @param data the method input data.
     * @param options the options for this request.
     * @return Observable<BatchResponseItem[]> the query observable.
     */
    CimConnection.prototype.setBatchInstance = function (nodeNamesList, namespace, className, keyProperties, data, options) {
        this.setPowerShellParameters(options, NodeCimOutput.Single, keyProperties, data && data.properties);
        var observable = PowerShellAlternate.createBatch(this.nodeConnection, this.batchConnection, nodeNamesList, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlSingleInstance(namespace, className, keyProperties);
        var urlList = [];
        var dataList = [];
        for (var index = 0; index < nodeNamesList.length; index++) {
            urlList.push(cimUrl);
            dataList.push(JSON.stringify(data));
        }
        return this.batchConnection.put(nodeNamesList, urlList, dataList, options);
    };
    /**
     * CIM DELETE SingleInstance for list of nodes
     *
     * @param nodeNamesList the Nodes to use for this request.
     * @param namespace the cim namespace.
     * @param className the class name.
     * @param keyProperties the key properties object.
     * @param options the options for this request.
     * @return Observable<BatchResponseItem[]> the query observable.
     */
    CimConnection.prototype.deleteBatchInstance = function (nodeNamesList, namespace, className, keyProperties, options) {
        this.setPowerShellParameters(options, NodeCimOutput.Single, keyProperties);
        var observable = PowerShellAlternate.createBatch(this.nodeConnection, this.batchConnection, nodeNamesList, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlSingleInstance(namespace, className, keyProperties);
        var urlList = [];
        for (var index = 0; index < nodeNamesList.length; index++) {
            urlList.push(cimUrl);
        }
        return this.batchConnection.delete(nodeNamesList, urlList, options);
    };
    /**
     * CIM POST WqlQuery for list of nodes
     *
     * @param nodeNamesList the Nodes to use for this request.
     * @param namespace the cim namespace.
     * @param query the WQL string.
     * @param options the options for this request.
     * @return Observable<BatchResponseItem[]> the query observable.
     */
    CimConnection.prototype.getBatchInstanceQuery = function (nodeNamesList, namespace, query, options) {
        this.setPowerShellParameters(options, NodeCimOutput.Query, options && options.powerShellParameters);
        var observable = PowerShellAlternate.createBatch(this.nodeConnection, this.batchConnection, nodeNamesList, options);
        if (observable) {
            return observable;
        }
        var cimUrl = Cim.cimUrlWqlQuery(namespace);
        var body = JSON.stringify({ query: query });
        return this.cimBatchPost(nodeNamesList, cimUrl, body, options);
    };
    /**
     * Cim batch post helper
     *
     * @param nodeNamesList The list of Nodes to run the call against
     * @param cimUrl The CIM end point to call
     * @param jsonBody The body of Post in json format.
     * @param options the request options.
     */
    CimConnection.prototype.cimBatchPost = function (nodeNamesList, cimUrl, jsonBody, options) {
        var urlList = [];
        var bodyList = [];
        for (var index = 0; index < nodeNamesList.length; index++) {
            urlList.push(cimUrl);
            if (jsonBody) {
                bodyList.push(jsonBody);
            }
        }
        return this.batchConnection.post(nodeNamesList, urlList, bodyList, options);
    };
    /**
     * Set PowerShell parameters to the options object.
     *
     * @param options The node request options.
     * @param outputType The output data type.
     * @param keys The key data.
     * @param data The arguments data.
     */
    CimConnection.prototype.setPowerShellParameters = function (options, cimOutput, keys, data) {
        if (options == null || options.powerShell == null) {
            return;
        }
        options.powerShellContext = {
            cimOutput: cimOutput,
            parameters: __assign({}, (keys || {}), (data || {}))
        };
    };
    return CimConnection;
}());
export { CimConnection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9jaW0tY29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sRUFBYSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFN0MsT0FBTyxFQUFFLEdBQUcsRUFBdUQsTUFBTSxPQUFPLENBQUM7QUFDakYsT0FBTyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVuRSxPQUFPLEVBQUUsYUFBYSxFQUFzQyxNQUFNLG1CQUFtQixDQUFDO0FBRXRGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRzdEOztHQUVHO0FBQ0g7SUFDSTs7Ozs7T0FLRztJQUNILHVCQUFvQixjQUE4QixFQUFVLGVBQWdDO1FBQXhFLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtJQUFJLENBQUM7SUFFakc7Ozs7Ozs7O09BUUc7SUFDSSwyQ0FBbUIsR0FBMUIsVUFDUSxRQUFnQixFQUNoQixTQUFpQixFQUNqQixTQUFpQixFQUNqQixPQUE0QjtRQUpwQyxpQkFjQztRQVRHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlELElBQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBYyxJQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBRUQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7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O1FBQ3BHLElBQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RILEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RCLENBQUM7UUFFRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNLLG9DQUFZLEdBQXBCLFVBQXFCLGFBQXVCLEVBQUUsTUFBYyxFQUFFLFFBQWdCLEVBQUUsT0FBNEI7UUFFeEcsSUFBSSxPQUFPLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUM1QixHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNLLCtDQUF1QixHQUEvQixVQUNRLE9BQTJCLEVBQzNCLFNBQXdCLEVBQ3hCLElBQVUsRUFDVixJQUFVO1FBQ2QsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELE9BQU8sQ0FBQyxpQkFBaUIsR0FBRztZQUN4QixTQUFTLFdBQUE7WUFDVCxVQUFVLGVBQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUU7U0FDbkQsQ0FBQTtJQUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBbmdCQSxBQW1nQkMsSUFBQSIsImZpbGUiOiJjaW0tY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=