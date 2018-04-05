import { Observable } from 'rxjs/Observable';
import { Cookie } from './cookie';
import { headerConstants } from './http-constants';
/**
 * Retry options for an http request
 */
var HttpRetryOptions = /** @class */ (function () {
    function HttpRetryOptions() {
        this.maxRetry = 0;
        this.handlers = [];
    }
    return HttpRetryOptions;
}());
export { HttpRetryOptions };
/**
 * The Http observable based class.
 */
var Http = /** @class */ (function () {
    function Http() {
        /**
         * The default retry options.
         */
        this.defaultRetryOptions = new HttpRetryOptions();
    }
    /**
     * The common request method.
     * Adds default responseType, contentType, Accept values if they are not already included in the request
     *
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.request = function (request, retryOptions) {
        if (!request) {
            request = {};
        }
        if (!retryOptions) {
            retryOptions = this.defaultRetryOptions;
        }
        if (!request.headers) {
            request.headers = {};
        }
        if (!request.responseType) {
            request.responseType = 'json';
        }
        if (request.headers && !request.headers['Content-Type']) {
            request.headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        if (request.headers && !request.headers['Accept']) {
            request.headers['Accept'] = 'application/json, text/plain, */*';
        }
        if (request.headers && !request.headers[headerConstants.CROSS_SITE_REQUEST_FORGERY_TOKEN]) {
            var token = Cookie.getCrossSiteRequestForgeryToken();
            if (token) {
                request.headers[headerConstants.CROSS_SITE_REQUEST_FORGERY_TOKEN] = token;
            }
        }
        if (retryOptions.maxRetry > 0 && retryOptions.handlers && retryOptions.handlers.length > 0) {
            return this.requestWithHandlers(request, retryOptions);
        }
        return Observable.ajax(request);
    };
    /**
     * Performs a request without modification.
     * If the result is an error, we will retry with the handlers in options
     *
     * @param request the request options.
     * @param options the retry options.
     * @param count the current iteration of the retry cycle.
     */
    Http.prototype.requestWithHandlers = function (request, retryOptions, count) {
        if (count === void 0) { count = 0; }
        return Observable.ajax(request)
            .catch(function (error, caught) {
            // original request is replaced with latest instance. it must take current error request.
            var caughtRequest = caught.source.request;
            if (++count > retryOptions.maxRetry) {
                return Observable.throw(error);
            }
            var handler = retryOptions.handlers.find(function (handler2) { return handler2.canHandle(error.status, error); });
            if (handler) {
                if (handler.handleNoRetry) {
                    return handler
                        .handleNoRetry(error.status, caughtRequest, error)
                        .flatMap(function () { return Observable.throw(error); });
                }
                else if (handler.handle) {
                    return handler.handle(error.status, caughtRequest, error)
                        .catch(function (handlerError) {
                        // if the handler throws, return the original error with an inserted property for the handler error    
                        error['handlerError'] = handlerError;
                        return Observable.throw(error);
                    })
                        .switchMap(function (nextRequest) { return Observable.ajax(caughtRequest); });
                }
            }
            return Observable.throw(error);
        });
    };
    /**
     * Performs a request with `get` http method.
     *
     * @param url the url.
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.get = function (url, request, options) {
        request = request ? request : {};
        request.url = url;
        request.method = Http.methodGet;
        return this.request(request, options);
    };
    /**
     * Performs a request with `post` http method.
     *
     * @param url the url.
     * @param body the body content.
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.post = function (url, body, request, options) {
        request = request ? request : {};
        request.url = url;
        request.method = Http.methodPost;
        request.body = body;
        return this.request(request, options);
    };
    /**
     * Performs a request with `put` http method.
     *
     * @param url the url.
     * @param body the body content.
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.put = function (url, body, request, options) {
        request = request ? request : {};
        request.url = url;
        request.method = Http.methodPut;
        request.body = body;
        return this.request(request, options);
    };
    /**
     * Performs a request with `delete` http method.
     *
     * @param url the url.
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.delete = function (url, request, options) {
        request = request ? request : {};
        request.url = url;
        request.method = Http.methodDelete;
        return this.request(request, options);
    };
    /**
     * Performs a request with `patch` http method.
     *
     * @param url the url.
     * @param body the body content.
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.patch = function (url, body, request, options) {
        request = request ? request : {};
        request.url = url;
        request.method = Http.methodPatch;
        request.body = body;
        return this.request(request, options);
    };
    /**
     * Performs a request with `head` http method.
     *
     * @param url the url.
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.head = function (url, request, options) {
        request = request ? request : {};
        request.url = url;
        request.method = Http.methodHead;
        return this.request(request, options);
    };
    /**
     * Performs a request with `options` http method.
     *
     * @param url the url.
     * @param request the request options.
     * @param options the retry options.
     */
    Http.prototype.options = function (url, request, options) {
        request = request ? request : {};
        request.url = url;
        request.method = Http.methodOptions;
        return this.request(request, options);
    };
    /**
     * Performs a request with 'get' http method with cache control.
     *
     * @param url the uri for GET call.
     * @return {Observable<any>} the observable for GET result data.
     */
    Http.prototype.getNoCache = function (url, noCache) {
        if (noCache === void 0) { noCache = true; }
        var publish = Observable.create(function (observer) {
            var request = new XMLHttpRequest();
            var handler = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        try {
                            observer.next({
                                status: request.status,
                                response: JSON.parse(request.response)
                            });
                            observer.complete();
                        }
                        catch (e) {
                            observer.error(e);
                        }
                    }
                    else {
                        observer.error(request.statusText);
                    }
                }
            };
            request.open('Get', url);
            if (noCache) {
                request.setRequestHeader('Cache-control', 'no-cache');
            }
            request.onreadystatechange = handler;
            request.send();
        });
        return publish;
    };
    /**
     * Performs a request with 'delete' http method without waiting for the response.
     *
     * @param url the uri for GET call.
     */
    Http.prototype.deleteQuick = function (url, headers) {
        var request = new XMLHttpRequest();
        request.open('Delete', url);
        request.responseType = 'json';
        request.setRequestHeader('Accept', 'application/json, text/plain, */*');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        request.setRequestHeader('Cache-control', 'no-cache');
        var xsrf = false;
        if (headers) {
            for (var key in headers) {
                if (key) {
                    request.setRequestHeader(key, headers[key]);
                    if (key.toLowerCase() === headerConstants.CROSS_SITE_REQUEST_FORGERY_TOKEN.toLowerCase()) {
                        xsrf = true;
                    }
                }
            }
        }
        var token = Cookie.getCrossSiteRequestForgeryToken();
        if (token && !xsrf) {
            request.setRequestHeader(headerConstants.CROSS_SITE_REQUEST_FORGERY_TOKEN, token);
        }
        // not watching any response.
        request.send();
    };
    /**
     * The ajax GET method.
     */
    Http.methodGet = 'GET';
    /**
     * The ajax POST method.
     */
    Http.methodPost = 'POST';
    /**
     * The ajax PUT method.
     */
    Http.methodPut = 'PUT';
    /**
     * The ajax DELETE method.
     */
    Http.methodDelete = 'DELETE';
    /**
     * The ajax PATCH method.
     */
    Http.methodPatch = 'PATCH';
    /**
     * The ajax HEAD method.
     */
    Http.methodHead = 'HEAD';
    /**
     * The ajax OPTIONS method.
     */
    Http.methodOptions = 'OPTIONS';
    return Http;
}());
export { Http };
//# sourceMappingURL=data:application/json;base64,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QixDQUFDLGNBQWMsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFdEQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDVixHQUFHLENBQUMsQ0FBQyxJQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzVDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxlQUFlLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN2RixJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNoQixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RixDQUFDO1FBRUQsNkJBQTZCO1FBQzdCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBM1NEOztPQUVHO0lBQ1csY0FBUyxHQUFHLEtBQUssQ0FBQztJQUVoQzs7T0FFRztJQUNXLGVBQVUsR0FBRyxNQUFNLENBQUM7SUFFbEM7O09BRUc7SUFDVyxjQUFTLEdBQUcsS0FBSyxDQUFDO0lBRWhDOztPQUVHO0lBQ1csaUJBQVksR0FBRyxRQUFRLENBQUM7SUFFdEM7O09BRUc7SUFDVyxnQkFBVyxHQUFHLE9BQU8sQ0FBQztJQUVwQzs7T0FFRztJQUNXLGVBQVUsR0FBRyxNQUFNLENBQUM7SUFFbEM7O09BRUc7SUFDVyxrQkFBYSxHQUFHLFNBQVMsQ0FBQztJQTJRNUMsV0FBQztDQTdTRCxBQTZTQyxJQUFBO1NBN1NZLElBQUkiLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=