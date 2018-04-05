import { Observable } from 'rxjs';
import { Crypto } from './crypto';
/**
 * Net communication class.
 */
var Net = /** @class */ (function () {
    function Net() {
    }
    Object.defineProperty(Net, "errorCodeMap", {
        get: function () {
            if (!Net.cachedErrorCodeMap) {
                var strings_1 = MsftSme.resourcesStrings().MsftSmeShell.Core;
                Net.cachedErrorCodeMap = {
                    // added from https://msdn.microsoft.com/en-us/library/aa392154(v=vs.85).aspx
                    0: strings_1.ErrorCode.Code0.message,
                    5: strings_1.ErrorCode.Code5.message,
                    50: strings_1.ErrorCode.Code50.message,
                    87: strings_1.ErrorCode.Code87.message,
                    110: strings_1.ErrorCode.Code110.message,
                    1323: strings_1.ErrorCode.Code1323.message,
                    1326: strings_1.ErrorCode.Code1326.message,
                    1355: strings_1.ErrorCode.Code1355.message,
                    2224: strings_1.ErrorCode.Code2224.message,
                    2691: strings_1.ErrorCode.Code2691.message,
                    2692: strings_1.ErrorCode.Code2692.message,
                    0x80041087: strings_1.ErrorCode.Code8004108.message
                };
            }
            return Net.cachedErrorCodeMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Encode a string with base64url.
     *
     * @param data the input string.
     * @return string the encoded string.
     */
    Net.base64urlEncode = function (data) {
        // base64URL encoding: RFC4648: http://tools.ietf.org/html/rfc4648#page-7
        var temp = window.btoa(data);
        var pad = temp.indexOf('=');
        if (pad > 0) {
            temp = temp.substr(0, pad);
        }
        temp = temp.replaceAll('+', '-').replaceAll('/', '_');
        return temp;
    };
    /**
     * Decode a base64 url string.
     *
     * @param data the string to decode.
     * @return string the decoded string.
     */
    Net.base64urlDecode = function (data) {
        while (data.length % 4 !== 0) {
            data += '=';
        }
        data = data.replaceAll('-', '+').replaceAll('_', '/');
        return window.atob(data);
    };
    /**
     * Encode utf8 string.
     *
     * @param data the unencoded string.
     */
    Net.utf8Encode = function (data) {
        return unescape(encodeURIComponent(data));
    };
    /**
     * Decode utf8 string.
     *
     * @param data the encoded UTF8 string.
     */
    Net.utf8Decode = function (data) {
        return decodeURIComponent(escape(data));
    };
    /**
     * Encode with utf8 (first) and base64url (second).
     *
     * @param data data the original string to encode. The string can be full unicode character string.
     * @return string the encoded string used on a part of URL.
     */
    Net.utf8Base64UrlEncode = function (data) {
        var utf8 = Net.utf8Encode(data);
        return Net.base64urlEncode(utf8);
    };
    /**
     * Decode with utf8 (second) and base64url (first).
     *
     * @param data data the encoded URL string to decode.
     * @return string the decoded unicode string.
     */
    Net.utf8Base64UrlDecode = function (data) {
        var utf8 = Net.base64urlDecode(data);
        return Net.utf8Decode(utf8);
    };
    /**
     * Create a key name from key value pairs.
     *
     * @param properties the key value pairs.
     * @return string the key name.
     */
    Net.cimCreateName = function (properties) {
        var data = JSON.stringify(properties);
        var utf8 = Net.utf8Encode(data);
        return Net.base64urlEncode(utf8);
    };
    /**
     * Get properties of the item from the response.
     *
     * @param data the item in the response object.
     * @return any the properties.
     */
    Net.getItemProperties = function (data) {
        if (data && data.properties) {
            return data.properties;
        }
        return data;
    };
    /**
     * Get properties of first item from the response.
     *
     * @param data the response object.
     * @return any the properties.
     */
    Net.getFirstProperties = function (data) {
        if (data && data.value && data.value.length) {
            if (data.value[0].properties) {
                return data.value[0].properties;
            }
        }
        else if (data && data.length) {
            return data[0];
        }
        return Net.getItemProperties(data);
    };
    /**
     * Get array of items from the response.
     *
     * @param data the response object.
     * @return any the item array.
     */
    Net.getItemArray = function (data) {
        if (data && data.value) {
            return data.value;
        }
        return data;
    };
    /**
     * Create JSON string with properties.
     *
     * @param data the input data.
     * @return string the JSON string with properties.
     */
    Net.createPropertiesJSONString = function (data) {
        return JSON.stringify({
            properties: data
        });
    };
    /**
     * Creates an encoded authentication header.
     *
     * @param usersName name of user.
     * @param password the password.
     * @return {string} the token string.
     */
    Net.createEncodedAuthenticationHeader = function (userNames, password) {
        var credentials = {
            // if only a username was provided, use '.' (shorthand for the locale machine hostname)
            domain: userNames.length === 1 ? '.' : userNames[0],
            username: userNames.length === 1 ? userNames[0] : userNames[1],
            password: password
        };
        return window.btoa(Net.utf8Encode(JSON.stringify(credentials)));
    };
    /**
     * Creates an encrypted authentication header value.
     *
     * @param jwk the JWK (Json Web Key)
     * @param usersName name of user.
     * @param password the password.
     * @return {string} the token string.
     */
    Net.createEncryptedAuthenticationHeader = function (jwk, userNames, password) {
        var credentials = {
            // if only a username was provided, use '.' (shorthand for the locale machine hostname)
            domain: userNames.length === 1 ? '.' : userNames[0],
            username: userNames.length === 1 ? userNames[0] : userNames[1],
            password: password,
            passwordEncryptedWith: undefined
        };
        return Crypto.encryptRsaSha1(jwk, password)
            .map(function (encryptedPassword) {
            credentials.password = encryptedPassword;
            credentials.passwordEncryptedWith = 'JWK';
            return window.btoa(Net.utf8Encode(JSON.stringify(credentials)));
        })
            .catch(function (error) { return Observable.of(window.btoa(Net.utf8Encode(JSON.stringify(credentials)))); });
    };
    /**
     * Upgrade existing plain token to JWK encrypted token for authentication header value.
     *
     * @param jwk the JWK (Json Web Key)
     * @param token the token value passed from other modules.
     * @return {Observable<{ upgraded: boolean, token: string }>} the token string.
     */
    Net.upgradeEncryptedAuthenticationHeader = function (jwk, token) {
        var credentials;
        var upgraded = false;
        var encoded = Net.utf8Decode(window.atob(token));
        if (!encoded || encoded.length >= token.length) {
            // don't know how to treat this.
            return Observable.of({ upgraded: upgraded, token: token });
        }
        try {
            credentials = JSON.parse(encoded);
        }
        catch (_a) {
            credentials = null;
        }
        if (!credentials || credentials.passwordEncryptedWith === 'JWK') {
            // don't know or already encrypted.
            return Observable.of({ upgraded: upgraded, token: token });
        }
        return Crypto.encryptRsaSha1(jwk, credentials.password)
            .catch(function (error) { return Observable.of({ upgraded: upgraded, token: token }); })
            .map(function (encryptedPassword) {
            credentials.password = encryptedPassword;
            credentials.passwordEncryptedWith = 'JWK';
            token = window.btoa(Net.utf8Encode(JSON.stringify(credentials)));
            upgraded = true;
            return { upgraded: upgraded, token: token };
        });
    };
    /**
     * Create /api/nodes URL with relativeUrl.
     *
     * @param gatewayName The name of gateway.
     * @param nodeName The name of node.
     * @param relativeUrl The relative Url.
     */
    Net.gatewayNodeApi = function (gatewayName, nodeName, relativeUrl) {
        if (!relativeUrl) {
            relativeUrl = '';
        }
        if (!relativeUrl.startsWith('/')) {
            relativeUrl = '/' + relativeUrl;
        }
        if (!nodeName) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ArgumentNullError.message;
            throw new Error(message.format('Net/gatewayNodeApi', 'nodeName'));
        }
        return Net.gatewayApi(gatewayName, "/nodes/" + nodeName + relativeUrl);
    };
    /**
     * Create /api URL with relativeUrl.
     *
     * @param gatewayName The name of gateway.
     * @param nodeName The name of node.
     * @param relativeUrl The relative Url.
     */
    Net.gatewayApi = function (gatewayName, relativeUrl) {
        if (!gatewayName) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ArgumentNullError.message;
            throw new Error(message.format('Net/gatewayApi', 'gatewayName'));
        }
        if (!relativeUrl) {
            relativeUrl = '';
        }
        if (!relativeUrl.startsWith('/')) {
            relativeUrl = '/' + relativeUrl;
        }
        gatewayName = gatewayName.toLowerCase();
        if (!gatewayName.startsWith('http://') && !gatewayName.startsWith('https://')) {
            gatewayName = 'https://' + gatewayName;
        }
        return gatewayName + "/api" + relativeUrl;
    };
    /**
     * Get error message from ajax result or any other error result and optionally includes native error message.
     *
     * @param error the error context from Net.ajax.
     * @param options add additional optional error message: such as native error messages if possible
     * @return string the error message.
     */
    Net.getErrorMessage = function (error, options) {
        var xhr = error && error.xhr;
        if (xhr && xhr.response) {
            var message = Net.parseErrorResponse(xhr.response, options);
            if (message) {
                return message;
            }
        }
        if (error && error.message) {
            return error.message;
        }
        var statusText = xhr && xhr.statusText;
        if (statusText) {
            return statusText;
        }
        var strings = MsftSme.resourcesStrings().MsftSmeShell.Core;
        throw new Error(strings.Error.NoResponseError.message);
    };
    /**
     * Get error message from PowerShell ajax response.
     * Can be used by a PowerShell batch consumer to get error message in batch response.
     *
     * @param response the ajax response.
     * @return string the error message.
     */
    Net.getPowerShellErrorMessage = function (response) {
        var message = Net.parseErrorResponse(response);
        if (message) {
            return message;
        }
        var strings = MsftSme.resourcesStrings().MsftSmeShell.Core;
        throw new Error(strings.Error.NoResponseError.message);
    };
    /**
     * Get error code from ajax result.
     *
     * @param error the error context from Net.ajax.
     * @return string the error code.
     */
    Net.getErrorCode = function (error) {
        var strings = MsftSme.resourcesStrings().MsftSmeShell.Core;
        var err = error && error.xhr && error.xhr.response && error.xhr.response.error;
        if (!err) {
            throw new Error(strings.Error.NoResponseError.message);
        }
        if (err.code) {
            return err.code;
        }
        throw new Error(strings.Error.NoCode.message);
    };
    /**
     * Get error message from ajax result excluding error stackTrace
     *
     * @param error the error context from Net.ajax.
     * @return string the error.
     */
    Net.getErrorMessageWithoutStacktrace = function (error) {
        var errorMessage = Net.getErrorMessage(error);
        if (errorMessage) {
            var stackTraceIndex = errorMessage.toLowerCase().indexOf('stacktrace');
            if (stackTraceIndex > 0) {
                errorMessage = errorMessage.substring(0, stackTraceIndex);
            }
        }
        return errorMessage;
    };
    /**
     * Translates error code to string
     *
     * @param code the error code
     * @return string the related error string.
     */
    Net.translateErrorCode = function (code) {
        var strings = MsftSme.resourcesStrings().MsftSmeShell.Core;
        var message = Net.errorCodeMap[code];
        if (message) {
            return strings.ErrorCode.Translated.message.format(message, code);
        }
        return strings.ErrorCode.Generic.message.format(code);
    };
    /**
     * Parse error message from standard ajax error and PowerShell errors.
     *
     * @param response the ajax response.
     * @return string the error message.
     */
    Net.parseErrorResponse = function (response, options) {
        var strings = MsftSme.resourcesStrings().MsftSmeShell.Core;
        var err = response && response.error;
        if (err && err.message) {
            var errorMessage = err.message;
            if (options && options.addNativeError && err.detailRecord) {
                return strings.Error.AddNativeErrorCode.message.format(errorMessage, err.detailRecord.nativeErrorCode);
            }
            return errorMessage;
        }
        var psErrors = response && response.errors;
        if (psErrors && psErrors.length > 0) {
            if (psErrors.length === 1) {
                if (options && options.addNativeError && psErrors[0].detailRecord) {
                    return strings.ErrorFormat.Single.Details.message.format(psErrors[0].errorType, psErrors[0].message, psErrors[0].detailRecord.nativeErrorCode);
                }
                return strings.ErrorFormat.Single.message.format(psErrors[0].errorType, psErrors[0].message);
            }
            var joinedMessage = '';
            for (var i = 0; i < psErrors.length; i++) {
                if (options && options.addNativeError && psErrors[i].detailRecord) {
                    joinedMessage += strings.ErrorFormat.Multiple.Details.message.format(i + 1, psErrors[i].errorType, psErrors[i].message, psErrors[i].detailRecord.nativeErrorCode);
                }
                else {
                    joinedMessage += strings.ErrorFormat.Multiple.message.format(i + 1, psErrors[i].errorType, psErrors[i].message);
                }
            }
            return joinedMessage;
        }
        if (response && response.exception) {
            return response.exception;
        }
        return null;
    };
    /**
     * The static definition of Web API URLs.
     */
    Net.apiRoot = '/api/{0}';
    Net.batch = '/batch';
    Net.streamSocket = '{0}/api/streams/socket/{1}';
    Net.downlevel = 'features/downlevelSupport';
    Net.downlevelInstall = Net.downlevel + '/install';
    Net.downlevelComponents = Net.downlevel + '/components';
    Net.cimClass = 'features/cim/namespaces/{0}/classes/{1}';
    Net.cimQuery = 'features/cim/query';
    Net.cimInvoke = '/methods/{0}/invoke';
    Net.powerShellApiInvokeCommand = 'features/powershellApi/invokeCommand';
    Net.powerShellApiSessions = 'features/powershellApi/pssessions/{0}';
    Net.powerShellApiExecuteCommand = Net.powerShellApiSessions + '/invokeCommand';
    Net.powerShellApiRetrieveOutput = Net.powerShellApiSessions + '?$expand=output';
    Net.powerShellApiCancelCommand = Net.powerShellApiSessions + '/cancel';
    Net.powerShellConsoleSessions = 'features/powershellConsole/pssessions/{0}';
    Net.powerShellConsoleExecuteCommand = Net.powerShellConsoleSessions + '/invokeCommand';
    Net.powerShellConsoleRetrieveOutput = Net.powerShellConsoleSessions + '?$expand=output';
    Net.stopCommand = Net.powerShellConsoleSessions + '/cancel';
    Net.tabCommand = Net.powerShellConsoleSessions + '/tab';
    Net.userProfile = '/profile';
    Net.fileTransferFormat = 'features/fileTransfer/files/{0}';
    Net.fileTransferDownloadPost = Net.fileTransferFormat + '/download';
    Net.fileTransferUpload = Net.fileTransferFormat + '/uploadlink';
    Net.jeaFeature = 'features/jea/endpoint';
    Net.jeaExport = Net.jeaFeature + '/export';
    // {HttpMethod} {relativeNodeUrl}  HTTP/1.1
    Net.multiPartCallBodyUrl = '{0} {1} HTTP/1.1';
    return Net;
}());
export { Net };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9uZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVsQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBeUJsQzs7R0FFRztBQUNIO0lBQUE7SUFtZUEsQ0FBQztJQWplRyxzQkFBbUIsbUJBQVk7YUFBL0I7WUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLElBQUksU0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0JBQ3BFLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRztvQkFDckIsNkVBQTZFO29CQUM3RSxDQUFDLEVBQUUsU0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTztvQkFDbEMsQ0FBQyxFQUFFLFNBQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU87b0JBQ2xDLEVBQUUsRUFBRSxTQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPO29CQUNwQyxFQUFFLEVBQUUsU0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTztvQkFDcEMsR0FBRyxFQUFFLFNBQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU87b0JBQ3RDLElBQUksRUFBRSxTQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPO29CQUN4QyxJQUFJLEVBQUUsU0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTztvQkFDeEMsSUFBSSxFQUFFLFNBQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU87b0JBQ3hDLElBQUksRUFBRSxTQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPO29CQUN4QyxJQUFJLEVBQUUsU0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTztvQkFDeEMsSUFBSSxFQUFFLFNBQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU87b0JBQ3hDLFVBQVUsRUFBRSxTQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPO2lCQUNwRCxDQUFDO1lBQ04sQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7UUFDbEMsQ0FBQzs7O09BQUE7SUFvQ0Q7Ozs7O09BS0c7SUFDVyxtQkFBZSxHQUE3QixVQUE4QixJQUFZO1FBQ3RDLHlFQUF5RTtRQUN6RSxJQUFJLElBQUksR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksR0FBRyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csbUJBQWUsR0FBN0IsVUFBOEIsSUFBWTtRQUN0QyxPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNCLElBQUksSUFBSSxHQUFHLENBQUM7UUFDaEIsQ0FBQztRQUVELElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7OztPQUlHO0lBQ1csY0FBVSxHQUF4QixVQUF5QixJQUFZO1FBQ2pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNXLGNBQVUsR0FBeEIsVUFBeUIsSUFBWTtRQUNqQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csdUJBQW1CLEdBQWpDLFVBQWtDLElBQVk7UUFDMUMsSUFBSSxJQUFJLEdBQVcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVyx1QkFBbUIsR0FBakMsVUFBa0MsSUFBWTtRQUMxQyxJQUFJLElBQUksR0FBVyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNXLGlCQUFhLEdBQTNCLFVBQTRCLFVBQWU7UUFDdkMsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxJQUFJLElBQUksR0FBVyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNXLHFCQUFpQixHQUEvQixVQUFnQyxJQUFTO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMzQixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVyxzQkFBa0IsR0FBaEMsVUFBaUMsSUFBUztRQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsQ0FBQztRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csZ0JBQVksR0FBMUIsVUFBMkIsSUFBUztRQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csOEJBQTBCLEdBQXhDLFVBQXlDLElBQVM7UUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDbEIsVUFBVSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNXLHFDQUFpQyxHQUEvQyxVQUFnRCxTQUFtQixFQUFFLFFBQWdCO1FBQ2pGLElBQUksV0FBVyxHQUFHO1lBQ2QsdUZBQXVGO1lBQ3ZGLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25ELFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzlELFFBQVEsRUFBRSxRQUFRO1NBQ3JCLENBQUM7UUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ1csdUNBQW1DLEdBQWpELFVBQWtELEdBQVcsRUFBRSxTQUFtQixFQUFFLFFBQWdCO1FBQ2hHLElBQUksV0FBVyxHQUFHO1lBQ2QsdUZBQXVGO1lBQ3ZGLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25ELFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzlELFFBQVEsRUFBRSxRQUFRO1lBQ2xCLHFCQUFxQixFQUFFLFNBQVM7U0FDbkMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7YUFDdEMsR0FBRyxDQUFDLFVBQUEsaUJBQWlCO1lBQ2xCLFdBQVcsQ0FBQyxRQUFRLEdBQUcsaUJBQWlCLENBQUM7WUFDekMsV0FBVyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztZQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXZFLENBQXVFLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ1csd0NBQW9DLEdBQWxELFVBQW1ELEdBQVcsRUFBRSxLQUFhO1FBQ3pFLElBQUksV0FBVyxDQUFDO1FBQ2hCLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdDLGdDQUFnQztZQUNoQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsVUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0QsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLElBQUQsQ0FBQztZQUNMLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxxQkFBcUIsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzlELG1DQUFtQztZQUNuQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsVUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUM7YUFDbEQsS0FBSyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsVUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQzthQUNsRCxHQUFHLENBQUMsVUFBQSxpQkFBaUI7WUFDbEIsV0FBVyxDQUFDLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQztZQUN6QyxXQUFXLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO1lBQzFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakUsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNoQixNQUFNLENBQUMsRUFBRSxRQUFRLFVBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNXLGtCQUFjLEdBQTVCLFVBQTZCLFdBQW1CLEVBQUUsUUFBZ0IsRUFBRSxXQUFvQjtRQUVwRixFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDZixXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLFdBQVcsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7WUFDcEcsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxZQUFVLFFBQVEsR0FBRyxXQUFhLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ1csY0FBVSxHQUF4QixVQUF5QixXQUFtQixFQUFFLFdBQW9CO1FBQzlELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztZQUNwRyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2YsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixXQUFXLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQztRQUNwQyxDQUFDO1FBRUQsV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RSxXQUFXLEdBQUcsVUFBVSxHQUFHLFdBQVcsQ0FBQztRQUMzQyxDQUFDO1FBRUQsTUFBTSxDQUFJLFdBQVcsWUFBTyxXQUFhLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNXLG1CQUFlLEdBQTdCLFVBQThCLEtBQVUsRUFBRSxPQUE2QjtRQUNuRSxJQUFJLEdBQUcsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLENBQUM7UUFDTCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3pCLENBQUM7UUFFRCxJQUFJLFVBQVUsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBRUQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztRQUNwRSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDVyw2QkFBeUIsR0FBdkMsVUFBd0MsUUFBYTtRQUNqRCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQztRQUVELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7UUFDcEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVyxnQkFBWSxHQUExQixVQUEyQixLQUFVO1FBQ2pDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7UUFDcEUsSUFBSSxHQUFHLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQy9FLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDcEIsQ0FBQztRQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1csb0NBQWdDLEdBQTlDLFVBQStDLEtBQVU7UUFDckQsSUFBSSxZQUFZLEdBQVcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxlQUFlLEdBQVcsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvRSxFQUFFLENBQUMsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsWUFBWSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzlELENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDVyxzQkFBa0IsR0FBaEMsVUFBaUMsSUFBWTtRQUN6QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQ3BFLElBQUksT0FBTyxHQUFXLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1ksc0JBQWtCLEdBQWpDLFVBQWtDLFFBQWEsRUFBRSxPQUE2QjtRQUMxRSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQ3BFLElBQUksR0FBRyxHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLFlBQVksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsY0FBYyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzNHLENBQUM7WUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3hCLENBQUM7UUFFRCxJQUFJLFFBQVEsR0FBVSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxjQUFjLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDcEQsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzlGLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakcsQ0FBQztZQUVELElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUN2QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdkMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxjQUFjLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLGFBQWEsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDaEUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDckcsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixhQUFhLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwSCxDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDekIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUM5QixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBemNEOztPQUVHO0lBQ1csV0FBTyxHQUFHLFVBQVUsQ0FBQztJQUNyQixTQUFLLEdBQUcsUUFBUSxDQUFDO0lBQ2pCLGdCQUFZLEdBQUcsNEJBQTRCLENBQUM7SUFDNUMsYUFBUyxHQUFHLDJCQUEyQixDQUFDO0lBQ3hDLG9CQUFnQixHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO0lBQzlDLHVCQUFtQixHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO0lBQ3BELFlBQVEsR0FBRyx5Q0FBeUMsQ0FBQztJQUNyRCxZQUFRLEdBQUcsb0JBQW9CLENBQUM7SUFDaEMsYUFBUyxHQUFHLHFCQUFxQixDQUFDO0lBQ2xDLDhCQUEwQixHQUFHLHNDQUFzQyxDQUFDO0lBQ3BFLHlCQUFxQixHQUFHLHVDQUF1QyxDQUFDO0lBQ2hFLCtCQUEyQixHQUFXLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxnQkFBZ0IsQ0FBQztJQUNuRiwrQkFBMkIsR0FBVyxHQUFHLENBQUMscUJBQXFCLEdBQUcsaUJBQWlCLENBQUM7SUFDcEYsOEJBQTBCLEdBQVcsR0FBRyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztJQUMzRSw2QkFBeUIsR0FBRywyQ0FBMkMsQ0FBQztJQUN4RSxtQ0FBK0IsR0FBVyxHQUFHLENBQUMseUJBQXlCLEdBQUcsZ0JBQWdCLENBQUM7SUFDM0YsbUNBQStCLEdBQVcsR0FBRyxDQUFDLHlCQUF5QixHQUFHLGlCQUFpQixDQUFDO0lBQzVGLGVBQVcsR0FBVyxHQUFHLENBQUMseUJBQXlCLEdBQUcsU0FBUyxDQUFDO0lBQ2hFLGNBQVUsR0FBVyxHQUFHLENBQUMseUJBQXlCLEdBQUcsTUFBTSxDQUFDO0lBQzVELGVBQVcsR0FBRyxVQUFVLENBQUM7SUFFekIsc0JBQWtCLEdBQUcsaUNBQWlDLENBQUM7SUFDdkQsNEJBQXdCLEdBQVcsR0FBRyxDQUFDLGtCQUFrQixHQUFHLFdBQVcsQ0FBQztJQUN4RSxzQkFBa0IsR0FBVyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsYUFBYSxDQUFDO0lBRXBFLGNBQVUsR0FBRyx1QkFBdUIsQ0FBQztJQUNyQyxhQUFTLEdBQUcsR0FBRyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFFckQsMkNBQTJDO0lBQzdCLHdCQUFvQixHQUFHLGtCQUFrQixDQUFDO0lBMGE1RCxVQUFDO0NBbmVELEFBbWVDLElBQUE7U0FuZVksR0FBRyIsImZpbGUiOiJuZXQuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9