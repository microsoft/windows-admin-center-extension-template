import { Observable } from 'rxjs/Observable';
import { Http } from '../data/http';
import { NativeQ } from '../data/native-q';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
import { EnvironmentModule } from './environment-modules';
/**
 * The Manifest service class.
 *  (Localized string cannot be used in this class due to initialization phase when the strings are not ready yet.)
 */
var ManifestLoader = /** @class */ (function () {
    function ManifestLoader() {
    }
    Object.defineProperty(ManifestLoader.prototype, "loaded", {
        /**
         * Manifest loading promise.
         */
        get: function () {
            return ManifestLoader.internalLoaded;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Load the manifest.
     */
    ManifestLoader.loadManifest = function () {
        var self = MsftSme.self();
        var mode = self.Init ? self.Init.mode : 0 /* NotUse */;
        var http = new Http();
        switch (mode) {
            case 0 /* NotUse */:
                // Turn OFF iframe feature.
                ManifestLoader.deferred.reject('no iFrame');
                break;
            case 1 /* LoadEmbedded */:
                // JSON file posting by module iframe.
                var manifest = {
                    name: self.Init.moduleName,
                    signature: EnvironmentModule.defaultSignature,
                    shell: {
                        name: EnvironmentModule.nameOfShell,
                        origin: self.Init.shellOrigin
                    }
                };
                // Turn ON module self-loading.
                ManifestLoader.load(http, manifest);
                break;
            case 2 /* Load */:
                // Turn ON iframe feature by Shell and Module.
                ManifestLoader.load(http);
                break;
        }
        return ManifestLoader.internalLoaded;
    };
    ;
    /**
     * Load the manifest into the MsftSme.Environment.
     *
     * @param http the http object to load the manifest.
     * @param manifest the self loading manifest.
     * @return Promise<any> the promise object.
     */
    ManifestLoader.load = function (http, manifest) {
        if (manifest) {
            ManifestLoader.update(manifest);
            return ManifestLoader.internalLoaded;
        }
        http.getNoCache(ManifestLoader.manifestFile)
            .flatMap(function (result) {
            var response = result.response;
            if (response.modules) {
                return ManifestLoader.fetchSideloadManifests(http)
                    .map(function (sideLoads) {
                    var sideloadShellOrigins = [];
                    sideLoads = sideLoads.filter(function (s) {
                        if (MsftSme.isNullOrUndefined(s)) {
                            return false;
                        }
                        var isShell = s.name === EnvironmentModule.nameOfShell;
                        if (isShell) {
                            sideloadShellOrigins.push(s.origin);
                        }
                        return !isShell;
                    });
                    if (sideloadShellOrigins.length > 0) {
                        Logging.log({
                            source: ManifestLoader.name,
                            level: LogLevel.Warning,
                            consoleGroupHeader: "Unable to sideload: \"" + sideloadShellOrigins + "\".",
                            // tslint:disable-next-line:max-line-length
                            message: "Cannot sideload " + EnvironmentModule.nameOfShell + " from " + sideloadShellOrigins + ". Did you mean to run " + EnvironmentModule.nameOfShell + " locally?"
                        });
                    }
                    return { manifest: response, sideLoads: sideLoads };
                });
            }
            return Observable.of({ manifest: response, sideLoads: [] });
        }).subscribe(function (result) {
            var modules = result.manifest.modules;
            result.sideLoads.forEach(function (sideLoad) {
                if (sideLoad) {
                    sideLoad.isSideLoaded = true;
                    var foundIndex = modules.findIndex(function (item, index, items) { return item.name === sideLoad.name; });
                    if (foundIndex >= 0) {
                        modules.splice(foundIndex, 1, sideLoad);
                    }
                    else {
                        modules.push(sideLoad);
                    }
                }
            });
            ManifestLoader.update(result.manifest);
        }, function (error) {
            ManifestLoader.deferred.reject(error);
            throw new Error(error);
        });
        return ManifestLoader.internalLoaded;
    };
    /**
     * retrieves all of the side loaded manifests.
     *
     * @return Observable<any[]> the manifests.
     */
    ManifestLoader.fetchSideloadManifests = function (http) {
        var sideLoadList = MsftSme.sideLoad();
        if (Object.keys(sideLoadList).length === 0) {
            return Observable.of([]);
        }
        var sideLoadManifestAwaiters = [];
        MsftSme.forEachKey(sideLoadList, function (key, sideLoad) {
            sideLoadManifestAwaiters.push(http.getNoCache(sideLoad.origin + "/" + ManifestLoader.manifestFile, false)
                .map(function (result) {
                var manifest = result.response;
                manifest.origin = sideLoad.origin;
                return manifest;
            })
                .catch(function (error) {
                // no localization
                Logging.log({
                    source: ManifestLoader.name,
                    level: LogLevel.Warning,
                    consoleGroupHeader: "Unable to sideload: \"" + sideLoad.origin + "\".",
                    message: "Cannot sideload " + sideLoad.origin + ". Please make sure that an extension is running at this origin."
                });
                return Observable.of(null);
            }));
        });
        return Observable.forkJoin.apply(Observable, sideLoadManifestAwaiters);
    };
    /**
     * Update the environment by the manifest.
     */
    ManifestLoader.update = function (manifest) {
        try {
            var self_1 = MsftSme.self();
            self_1.Environment = EnvironmentModule.createEnvironment(manifest, self_1.Resources.localeId);
            ManifestLoader.deferred.resolve();
        }
        catch (e) {
            // no localization
            var message = 'Unable to load the manifest: {0}'.format(e);
            ManifestLoader.deferred.reject(message);
            throw new Error(message);
        }
    };
    ManifestLoader.manifestFile = 'manifest.json';
    ManifestLoader.deferred = NativeQ.defer();
    ManifestLoader.internalLoaded = ManifestLoader.deferred.promise;
    return ManifestLoader;
}());
export { ManifestLoader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvbWFuaWZlc3QvbWFuaWZlc3QtbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFEOzs7R0FHRztBQUNIO0lBQUE7SUEwS0EsQ0FBQztJQWxLRyxzQkFBVyxrQ0FBTTtRQUhqQjs7V0FFRzthQUNIO1lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7UUFDekMsQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNXLDJCQUFZLEdBQTFCO1FBQ0ksSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLElBQUksSUFBSSxHQUE0QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQStCLENBQUM7UUFDaEcsSUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1g7Z0JBQ0ksMkJBQTJCO2dCQUMzQixjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDNUMsS0FBSyxDQUFDO1lBQ1Y7Z0JBQ0ksc0NBQXNDO2dCQUN0QyxJQUFJLFFBQVEsR0FBUTtvQkFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtvQkFDMUIsU0FBUyxFQUFF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QixNQUFJLENBQUMsV0FBVyxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFGLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxrQkFBa0I7WUFDbEIsSUFBSSxPQUFPLEdBQUcsa0NBQWtDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNELGNBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsQ0FBQztJQUNMLENBQUM7SUF4S2MsMkJBQVksR0FBRyxlQUFlLENBQUM7SUFDL0IsdUJBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFPLENBQUM7SUFDaEMsNkJBQWMsR0FBaUIsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUF1S2xGLHFCQUFDO0NBMUtELEFBMEtDLElBQUE7U0ExS1ksY0FBYyIsImZpbGUiOiJtYW5pZmVzdC1sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiQzovQkEvNDQ3L3MvaW5saW5lU3JjLyJ9