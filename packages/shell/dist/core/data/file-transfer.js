import { Observable } from 'rxjs/Observable';
import { EnvironmentModule } from '../manifest/environment-modules';
import { Cookie } from './cookie';
import { headerConstants, HttpStatusCode } from './http-constants';
import { NativeQ } from './native-q';
import { Net } from './net';
var FileTransfer = /** @class */ (function () {
    /**
     * Initializes a new instance of the FileTransfer class.
     *
     * @param nodeConnection the NodeConnection class instance.
     * @param gatewayConnection the GatewayConnection class instance.
     * @param authorizationManager the AuthorizationManager class instance.
     */
    function FileTransfer(nodeConnection, gatewayConnection, authorizationManager) {
        this.nodeConnection = nodeConnection;
        this.gatewayConnection = gatewayConnection;
        this.authorizationManager = authorizationManager;
        this.moduleName = null;
    }
    /**
     * Downloads a blob of data
     *
     * @param blob the blob of data to download
     * @param fileName the name of the file for the user to download.
     */
    FileTransfer.downloadBlob = function (blob, fileName) {
        var useAnchorTagForDownload = true;
        if (window.navigator.msSaveOrOpenBlob) {
            // This is for IE and Microsoft Edge < 16
            // for those cases the download anchor tag doesn't generate the right name so we use the MS download system instead
            // "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393"
            var ua = navigator.userAgent;
            var edgeIndex = ua.indexOf('Edge');
            if (edgeIndex > 0) {
                var dotIndex = ua.indexOf('.', edgeIndex);
                var versionNumber = 0;
                if (dotIndex > 0) {
                    var versionString = ua.substring(edgeIndex + 'Edge'.length + 1, dotIndex);
                    versionNumber = Number(versionString);
                }
                useAnchorTagForDownload = versionNumber > 15;
            }
            else {
                useAnchorTagForDownload = false;
            }
        }
        if (useAnchorTagForDownload) {
            var downloadLink = document.createElement('a');
            downloadLink.style.display = 'none';
            var url = URL.createObjectURL(blob);
            downloadLink.setAttribute('href', url);
            downloadLink.setAttribute('download', fileName);
            downloadLink.click();
            downloadLink.remove();
        }
        else {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }
    };
    /**
     * The GET call to file transfer endpoint and manual download of stream
     *
     * @param nodeName the node to transfer the file from.
     * @param sourcePath the path of the remote file to transfer.
     * @param targetName the desired name for the downloaded file.
     * @param fileOptions the file options for the action.
     * @return Observable<Blob> the observable Blob object.
     */
    FileTransfer.prototype.transferFile = function (nodeName, sourcePath, targetName, fileOptions) {
        var relativeUrl = Net.fileTransferFormat.format(Net.utf8Base64UrlEncode(sourcePath));
        var headers = {
            Accept: 'application/octet-stream'
        };
        var token = Cookie.getCrossSiteRequestForgeryToken();
        if (token) {
            headers[headerConstants.CROSS_SITE_REQUEST_FORGERY_TOKEN] = token;
        }
        var request = { headers: headers, responseType: 'blob' };
        if (fileOptions) {
            request.logAudit = fileOptions.logAudit;
            request.logTelemetry = fileOptions.logTelemetry;
        }
        return this.nodeConnection.get(nodeName, relativeUrl, request).map(function (responseBlob) {
            FileTransfer.downloadBlob(responseBlob, targetName);
            return responseBlob;
        });
    };
    /**
     * Upload a file from fileObject.
     *
     * @param nodeName the node to upload the file to.
     * @param path the file path to store on the target node.
     * @param fileObject the file object created on the UI.
     * @param fileOptions the file options for the action.
     * @return Observable<any> the observable object.
     */
    FileTransfer.prototype.uploadFile = function (nodeName, path, fileObject, fileOptions) {
        var _this = this;
        var deferred = NativeQ.defer();
        var relativeUrl = Net.fileTransferFormat.format(Net.utf8Base64UrlEncode(path));
        var formData = new FormData();
        formData.append('file-0', fileObject);
        var request = new XMLHttpRequest();
        var url = Net.gatewayNodeApi(this.gatewayConnection.gatewayUrl, nodeName, relativeUrl);
        var handler = function () {
            if (request.readyState === 4 /* complete */) {
                if (request.status === HttpStatusCode.Ok) {
                    deferred.resolve(request.responseText);
                }
                else {
                    if (request.status === HttpStatusCode.Forbidden) {
                        // inform the gateway that we should be in the forbidden state.
                        _this.gatewayConnection.enterForbiddenState();
                    }
                    var uploadError = MsftSme.resourcesStrings().MsftSmeShell.Alerts.DirectoryList.Upload.Error;
                    var message = request.status === 0 ? uploadError.FileNotFound
                        : (request.status === 400 ? uploadError.OperationBlocked
                            : uploadError.Unknown);
                    deferred.reject({ xhr: request, message: message });
                }
            }
        };
        var tokenValue;
        var ajaxRequest = { headers: {} };
        this.authorizationManager.addAuthorizationRequestHeader(ajaxRequest, nodeName);
        request.open('PUT', url);
        tokenValue = ajaxRequest.headers[headerConstants.SME_AUTHORIZATION];
        if (tokenValue) {
            request.setRequestHeader(headerConstants.SME_AUTHORIZATION, tokenValue);
        }
        tokenValue = ajaxRequest.headers[headerConstants.USE_LAPS];
        if (tokenValue) {
            request.setRequestHeader(headerConstants.USE_LAPS, tokenValue);
            // If ajaxRequest.headers[LAPS_LOCALADMINNAME] will always have default of 'administrator',
            // so no need to check if it exists and not null
            request.setRequestHeader(headerConstants.LAPS_LOCALADMINNAME, ajaxRequest.headers[headerConstants.LAPS_LOCALADMINNAME]);
        }
        if (fileOptions) {
            if (fileOptions.logAudit === true || fileOptions.logAudit === false) {
                request.setRequestHeader(headerConstants.LOG_AUDIT, fileOptions.logAudit ? 'true' : 'false');
            }
            if (fileOptions.logTelemetry === true || fileOptions.logTelemetry === false) {
                request.setRequestHeader(headerConstants.LOG_TELEMETRY, fileOptions.logTelemetry ? 'true' : 'false');
            }
        }
        var token = Cookie.getCrossSiteRequestForgeryToken();
        if (token) {
            request.setRequestHeader(headerConstants.CROSS_SITE_REQUEST_FORGERY_TOKEN, token);
        }
        request.setRequestHeader(headerConstants.MODULE_NAME, this.nameOfModule);
        request.onreadystatechange = handler;
        request.withCredentials = true;
        request.send(formData);
        return Observable.fromPromise(deferred.promise);
    };
    Object.defineProperty(FileTransfer.prototype, "nameOfModule", {
        /**
         * Gets the name of current shell or module.
         */
        get: function () {
            if (!this.moduleName) {
                this.moduleName = EnvironmentModule.getModuleName();
            }
            return this.moduleName;
        },
        enumerable: true,
        configurable: true
    });
    return FileTransfer;
}());
export { FileTransfer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9maWxlLXRyYW5zZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUc3QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUVwRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbkUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBZTVCO0lBK0NJOzs7Ozs7T0FNRztJQUNILHNCQUNZLGNBQThCLEVBQzlCLGlCQUFvQyxFQUNwQyxvQkFBMEM7UUFGMUMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQXZEOUMsZUFBVSxHQUFHLElBQUksQ0FBQztJQXVEZ0MsQ0FBQztJQXJEM0Q7Ozs7O09BS0c7SUFDVyx5QkFBWSxHQUExQixVQUEyQixJQUFVLEVBQUUsUUFBZ0I7UUFDbkQsSUFBSSx1QkFBdUIsR0FBRyxJQUFJLENBQUM7UUFFbkMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDcEMseUNBQXlDO1lBQ3pDLG1IQUFtSDtZQUNuSCw2SEFBNkg7WUFDN0gsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztZQUM3QixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLFFBQVEsR0FBRyxFQUFF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QUM7UUFDNUgsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDZCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxXQUFXLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakcsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEtBQUssSUFBSSxJQUFJLFdBQVcsQ0FBQyxZQUFZLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDMUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6RyxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDUixPQUFPLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFFRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFekUsT0FBTyxDQUFDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQztRQUNyQyxPQUFPLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBS0Qsc0JBQVksc0NBQVk7UUFIeEI7O1dBRUc7YUFDSDtZQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsaUJBQWlCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEQsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzNCLENBQUM7OztPQUFBO0lBQ0wsbUJBQUM7QUFBRCxDQXhMQSxBQXdMQyxJQUFBIiwiZmlsZSI6ImZpbGUtdHJhbnNmZXIuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9