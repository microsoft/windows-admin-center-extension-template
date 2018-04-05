import { Observable } from 'rxjs';
/**
 * Abstract class of SharedCache by using session storage.
 *
 * TClass: the caching data class type.
 * TData: the caching data interface type.
 * TParams: the data query parameters type.
 */
var SharedCache = /** @class */ (function () {
    /**
     * Initializes a new instance of the SharedCache class.
     *
     * @param uniqueId the unique identity of the colleciton of data.
     * @param uniqueVersion the unique version of data. (Should increment any data format or query change)
     * @param instanceId the instance id generator.
     * @param serialize the data serializarion.
     * @param deserialize the data deserialization.
     * @param getDataQuery the query observable.
     * @param options the shared cache options.
     */
    function SharedCache(uniqueId, uniqueVersion, instanceId, serialize, deserialize, getDataQuery, options) {
        this.uniqueId = uniqueId;
        this.uniqueVersion = uniqueVersion;
        this.instanceId = instanceId;
        this.serialize = serialize;
        this.deserialize = deserialize;
        this.getDataQuery = getDataQuery;
        this.options = options;
        this.cache = {};
    }
    Object.defineProperty(SharedCache.prototype, "id", {
        /**
         * Gets the id of the collection of data.
         */
        get: function () {
            return this.uniqueId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SharedCache.prototype, "version", {
        /**
         * Gets the version of the cache for format and query.
         */
        get: function () {
            return this.uniqueVersion;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check if the Cache has unexpired data available for the instance id.
     * @param params the parameter to check for the data.
     */
    SharedCache.prototype.isAvailable = function (params) {
        var instanceId = this.instanceId(params);
        if (this.cache[instanceId] && !this.expired(this.cache[instanceId])) {
            return true;
        }
        if (sessionStorage[this.cacheKey]) {
            this.sessionRestore();
            if (this.cache[instanceId] && !this.expired(this.cache[instanceId])) {
                return true;
            }
        }
        return false;
    };
    /**
     * Query to find the data.
     * @param params the parameter to query the data.
     */
    SharedCache.prototype.query = function (params) {
        if (this.isAvailable(params)) {
            var instanceId = this.instanceId(params);
            return Observable.of(this.cache[instanceId]);
        }
        return this.update(params);
    };
    /**
     * Refresh the data.
     * @param params the parameter to query the data.
     */
    SharedCache.prototype.refresh = function (params) {
        var instanceId = this.instanceId(params);
        if (sessionStorage[this.cacheKey]) {
            this.sessionRestore();
        }
        return this.update(params);
    };
    /**
     * Save an instance data to session storage.
     *
     * @param params the parameter to query the data.
     * @param data the data object to store.
     */
    SharedCache.prototype.save = function (params, data) {
        var instanceId = this.instanceId(params);
        if (sessionStorage[this.cacheKey]) {
            this.sessionRestore();
        }
        this.sessionSave(params, data);
    };
    /**
     * Clear the cache.
     *
     * @param params the parameter to query the data (optional to delete an instane)
     */
    SharedCache.prototype.clear = function (params) {
        if (params) {
            if (sessionStorage[this.cacheKey]) {
                this.sessionRestore();
            }
            this.sessionSave(params);
        }
        else {
            this.cache = {};
            sessionStorage[this.cacheKey] = JSON.stringify(this.cache);
        }
    };
    /**
     * Force restore whole data and return the data for the params specified.
     *
     * @param params the parameter to query the data.
     * @return SharedCacheContainer<TClass> the data for the params specified.
     */
    SharedCache.prototype.forceRestore = function (params) {
        if (sessionStorage[this.cacheKey]) {
            var instanceId = this.instanceId(params);
            this.sessionRestore();
            return this.cache[instanceId];
        }
        return null;
    };
    SharedCache.prototype.expired = function (data) {
        if (this.options && this.options.forceRefresh) {
            return true;
        }
        if (!this.options || !this.options.expiration) {
            return false;
        }
        return (Date.now() - data.timestamp) > this.options.expiration;
    };
    SharedCache.prototype.update = function (params) {
        var _this = this;
        if (this.getDataQuery) {
            var instanceId_1 = this.instanceId(params);
            return this.getDataQuery(params).map(function (data) {
                _this.sessionSave(params, data);
                return _this.cache[instanceId_1];
            });
        }
        else {
            return Observable.of(null);
        }
    };
    SharedCache.prototype.sessionRestore = function () {
        var _this = this;
        var preProcessed = JSON.parse(sessionStorage[this.cacheKey]);
        var cache = {};
        var keys = Object.keys(preProcessed);
        keys.forEach(function (key) {
            cache[key] = {
                timestamp: preProcessed[key].timestamp,
                instance: _this.deserialize(preProcessed[key].instance)
            };
        });
        this.cache = cache;
    };
    SharedCache.prototype.sessionSave = function (params, data) {
        var _this = this;
        var instanceId = this.instanceId(params);
        if (data) {
            this.cache[instanceId] = { timestamp: Date.now(), instance: data };
        }
        else {
            delete this.cache[instanceId];
        }
        var preProcessed = {};
        var keys = Object.keys(this.cache);
        keys.forEach(function (key) {
            preProcessed[key] = {
                timestamp: _this.cache[key].timestamp,
                instance: _this.serialize(_this.cache[key].instance)
            };
        });
        sessionStorage[this.cacheKey] = JSON.stringify(preProcessed);
    };
    Object.defineProperty(SharedCache.prototype, "cacheKey", {
        get: function () {
            // used as sessionStorage key name.
            return 'shared-cache:{0}.{1}'.format(this.id, this.version);
        },
        enumerable: true,
        configurable: true
    });
    return SharedCache;
}());
export { SharedCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2hhcmVkL3NoYXJlZC1jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBOEJsQzs7Ozs7O0dBTUc7QUFDSDtJQUdJOzs7Ozs7Ozs7O09BVUc7SUFDSCxxQkFDWSxRQUFnQixFQUNoQixhQUFxQixFQUNyQixVQUF1QyxFQUN2QyxTQUF1QyxFQUN2QyxXQUEyQyxFQUMzQyxZQUFzRCxFQUN0RCxPQUE0QjtRQU41QixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQ3JCLGVBQVUsR0FBVixVQUFVLENBQTZCO1FBQ3ZDLGNBQVMsR0FBVCxTQUFTLENBQThCO1FBQ3ZDLGdCQUFXLEdBQVgsV0FBVyxDQUFnQztRQUMzQyxpQkFBWSxHQUFaLFlBQVksQ0FBMEM7UUFDdEQsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFwQmhDLFVBQUssR0FBa0MsRUFBRSxDQUFDO0lBb0JOLENBQUM7SUFLN0Msc0JBQVcsMkJBQUU7UUFIYjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFLRCxzQkFBVyxnQ0FBTztRQUhsQjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDOUIsQ0FBQzs7O09BQUE7SUFFRDs7O09BR0c7SUFDSSxpQ0FBVyxHQUFsQixVQUFtQixNQUFlO1FBQzlCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsSUFBSSxD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Q0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHO1lBQ1osWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFpQztnQkFDOUMsU0FBUyxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUztnQkFDcEMsUUFBUSxFQUFFLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDckQsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0gsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxzQkFBWSxpQ0FBUTthQUFwQjtZQUNJLG1DQUFtQztZQUNuQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hFLENBQUM7OztPQUFBO0lBQ0wsa0JBQUM7QUFBRCxDQWhNQSxBQWdNQyxJQUFBIiwiZmlsZSI6InNoYXJlZC1jYWNoZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=