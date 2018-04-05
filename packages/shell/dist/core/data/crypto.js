import { Observable } from 'rxjs';
/**
 * Web Crypto interface class.
 */
var Crypto = /** @class */ (function () {
    function Crypto() {
    }
    /**
     * hash with SHA-256
     * (If it doesn't support web based crypto, encode as base64.)
     * @param data the original data to hash.
     * @return Observable<string> the hash generated.
     */
    Crypto.getSha256 = function (data) {
        if (data == null) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ArgumentNullError.message;
            return Observable.throw(new Error(message.format('Crypto/getSha256', 'data')));
        }
        var root = window;
        var isIE = !!root.msCrypto;
        if (isIE && root.msCrypto.subtle) {
            return Crypto.hash256IE(root.msCrypto.subtle, data);
        }
        if (root.crypto) {
            var subtle = root.crypto.subtle || root.crypto.webkitSubtle;
            if (subtle) {
                return Crypto.hash256WebAPI(subtle, data);
            }
        }
        return Observable.of(window.btoa(data));
    };
    /**
     * encrypt with RSA/SHA-1
     *
     * @param jwk the JSON Web Key. Single string with JSON.stringify format.
     * @param data the original data to hash.
     * @return Observable<string> the hash generated.
     */
    Crypto.encryptRsaSha1 = function (jwk, data) {
        var message = '';
        if (jwk == null) {
            message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ArgumentNullError.message;
            return Observable.throw(new Error(message.format('Crypto/encryptRsaSha1', 'jwk')));
        }
        if (data == null) {
            message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ArgumentNullError.message;
            return Observable.throw(new Error(message.format('Crypto/encryptRsaSha1', 'data')));
        }
        var root = window;
        var isIE = !!root.msCrypto;
        if (isIE && root.msCrypto.subtle) {
            return Crypto.encryptRsaIE(root.msCrypto.subtle, jwk, data);
        }
        if (root.crypto) {
            var subtle = root.crypto.subtle;
            if (subtle) {
                var jwkObject = JSON.parse(jwk);
                return Crypto.encryptRsaWebAPI(subtle, jwkObject, data);
            }
            subtle = root.crypto.webkitSubtle;
            if (subtle) {
                var jwkArray = Crypto.toArrayBufferView(jwk);
                return Crypto.encryptRsaWebAPI(subtle, jwkArray, data);
            }
        }
        message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.UnknownBrowser.message;
        return Observable.throw(new Error(message.format('Crypto/encryptRsaSha1')));
    };
    /**
     * sign with HMAC/SHA-256
     *
     * @param key the key (base64 encoded).
     * @param data the original data to hash. (unicode - not utf8)
     * @return Observable<string> the hash generated.
     */
    Crypto.signHmac = function (key, data) {
        var message = '';
        if (key == null) {
            message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ArgumentNullError.message;
            return Observable.throw(new Error(message.format('Crypto/signHmac', 'key')));
        }
        if (data == null) {
            message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.ArgumentNullError.message;
            return Observable.throw(new Error(message.format('Crypto/encryptRsaSha1', 'data')));
        }
        var root = window;
        var isIE = !!root.msCrypto;
        if (isIE && root.msCrypto.subtle) {
            return Crypto.signHmacIE(root.msCrypto.subtle, key, data);
        }
        if (root.crypto) {
            var subtle = root.crypto.subtle || root.crypto.webkitSubtle;
            if (subtle) {
                return Crypto.signHmacWebAPI(subtle, key, data);
            }
        }
        message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.UnknownBrowser.message;
        return Observable.throw(new Error(message.format('Crypto/signHmac')));
    };
    /**
     * Hash with SHA-256 for WebAPI.
     *
     * @param subtle the Web API subtle.
     * @param data the original data to hash.
     * @return Observable<string> the hash generated.
     */
    Crypto.hash256WebAPI = function (subtle, data) {
        return Observable.create(function (observer) {
            var array = Crypto.toUint8Array(data);
            subtle.digest({ name: 'SHA-256' }, array)
                .then(function (hash) {
                var hexText = Crypto.toHexString(hash);
                observer.next(hexText);
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    /**
     * Hash with SHA-256 for IE/Older API.
     *
     * @param subtle the older API subtle.
     * @param data the original data to hash.
     * @return Observable<string> the hash generated.
     */
    Crypto.hash256IE = function (subtle, data) {
        return Observable.create(function (observer) {
            var array = Crypto.toUint8Array(data);
            var cryptoOp = subtle.digest({ name: 'SHA-256' }, array);
            cryptoOp.oncomplete = function (event) {
                var hexText = Crypto.toHexString(event.target.result);
                observer.next(hexText);
                observer.complete();
            };
            cryptoOp.onerror = function (error) {
                if (!observer.closed) {
                    observer.error(error);
                }
            };
            cryptoOp.finish();
        });
    };
    /**
     * Encrypt with RSA/SHA-1 for WebAPI.
     *
     * @param subtle the Web API subtle.
     * @param jwkObject the JSON Web key object or ArrayBufferView on webkit.
     * @param data the original data to encrypt.
     * @return Observable<string> the encrypted base64 string.
     */
    Crypto.encryptRsaWebAPI = function (subtle, jwkObject, data) {
        return Observable.create(function (observer) {
            var array = Crypto.toUtf8ArrayBuffer(data);
            subtle.importKey('jwk', jwkObject, Crypto.algRsaOaepSha1Key, false, ['encrypt'])
                .then(function (publicKey) {
                return subtle.encrypt(Crypto.algRsaOaepSha1Key, publicKey, array);
            })
                .then(function (result) {
                observer.next(Crypto.createBase64(result));
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    /**
     * Encrypt with RSA/SHA-1 for IE/Older API.
     *
     * @param subtle the older API subtle.
     * @param jwk the JSON Web key format (Stringfiy).
     * @param data the original data to hash.
     * @return Observable<string> the encrypted base64 string.
     */
    Crypto.encryptRsaIE = function (subtle, jwk, data) {
        return Observable.create(function (observer) {
            var array = Crypto.toUtf8ArrayBuffer(data);
            var onerror = function (error) {
                if (!observer.closed) {
                    observer.error(error);
                }
            };
            var jwkBytes = Crypto.toArrayBuffer(jwk);
            var importKeyOp = subtle.importKey('jwk', jwkBytes, Crypto.algRsaOaepSha1Key, false, ['encrypt']);
            importKeyOp.oncomplete = function (importKeyOpOnCompleteEvent) {
                var publicKey = importKeyOpOnCompleteEvent.target.result;
                var encryptOp = subtle.encrypt(Crypto.algRsaOaepSha1Key, publicKey, array);
                encryptOp.oncomplete = function (encryptOpOnCompleteEvent) {
                    observer.next(Crypto.createBase64(encryptOpOnCompleteEvent.target.result));
                    observer.complete();
                };
                encryptOp.onerror = onerror;
            };
            importKeyOp.onerror = onerror;
        });
    };
    /**
     * Sign with HMAC for WebAPI.
     *
     * @param subtle the Web API subtle.
     * @param key the key.
     * @param data the original data to encrypt.
     * @return Observable<string> the encrypted base64 string.
     */
    Crypto.signHmacWebAPI = function (subtle, key, data) {
        return Observable.create(function (observer) {
            var array = Crypto.toUtf8ArrayBuffer(data);
            var keyObject = Crypto.toArrayBufferView(window.atob(key));
            subtle.importKey('raw', keyObject, Crypto.algHmacSha256Key, false, ['sign'])
                .then(function (publicKey) {
                return subtle.sign(Crypto.algHmacSha256Key, publicKey, array);
            })
                .then(function (result) {
                observer.next(Crypto.createBase64(result));
                observer.complete();
            }, function (error) {
                observer.error(error);
            });
        });
    };
    /**
     * Sign with HMAC for IE/Older API.
     *
     * @param subtle the older API subtle.
     * @param jwk the key.
     * @param data the original data to hash.
     * @return Observable<string> the encrypted base64 string.
     */
    Crypto.signHmacIE = function (subtle, key, data) {
        return Observable.create(function (observer) {
            var array = Crypto.toUtf8ArrayBuffer(data);
            var onerror = function (error) {
                if (!observer.closed) {
                    observer.error(error);
                }
            };
            var keyBytes = Crypto.toArrayBuffer(window.atob(key));
            var importKeyOp = subtle.importKey('raw', keyBytes, Crypto.algHmacSha256Key, false, ['sign']);
            importKeyOp.oncomplete = function (importKeyOpEvent) {
                var publicKey = importKeyOpEvent.target.result;
                var encryptOp = subtle.sign(Crypto.algHmacSha256Key, publicKey, array);
                encryptOp.oncomplete = function (encryptOpEvent) {
                    observer.next(Crypto.createBase64(encryptOpEvent.target.result));
                    observer.complete();
                };
                encryptOp.onerror = onerror;
            };
            importKeyOp.onerror = onerror;
        });
    };
    /**
     * Create hex string from byte raw data.
     *
     * @param bytes the array buffer.
     * @return string the hex string.
     */
    Crypto.toHexString = function (bytes) {
        var array = new Uint8Array(bytes);
        var hexText = '';
        for (var i = 0; i < array.length; i++) {
            var hex = array[i].toString(16);
            hexText += (hex.length === 1 ? '0' : '') + hex;
        }
        return hexText;
    };
    /**
     * Create Uint8Array from a string.
     *
     * @param data The string data.
     * @return Uint8Array The bytes array.
     */
    Crypto.toUint8Array = function (data) {
        var temp = [];
        for (var i = 0; i < data.length; i++) {
            var ch = data.charCodeAt(i);
            /* tslint:disable:no-bitwise */
            temp.push((ch & 0x0ff00) >> 8);
            temp.push(ch & 0x0ff);
            /* tslint:enable:no-bitwise */
        }
        return new Uint8Array(temp);
    };
    /**
     * Create ArrayBuffer from a string with unicode.
     *
     * @param data The string data.
     * @return ArrayBuffer The bytes array.
     */
    Crypto.toUtf8ArrayBuffer = function (data) {
        var utf8 = Crypto.utf8Encode(data);
        return Crypto.toArrayBuffer(utf8);
    };
    /**
     * Encode utf8 string.
     *
     * @param data the unencoded string.
     */
    Crypto.utf8Encode = function (data) {
        return unescape(encodeURIComponent(data));
    };
    /**
     * Create ArrayBuffer from a string with unicode.
     *
     * @param data The string data.
     * @return ArrayBuffer The bytes array.
     */
    Crypto.toArrayBuffer = function (data) {
        var buffer = new ArrayBuffer(data.length);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < buffer.byteLength; i++) {
            view[i] = data.charCodeAt(i);
        }
        return buffer;
    };
    /**
     * Create ArrayBufferView from a string with unicode.
     *
     * @param data The string data.
     * @return ArrayBuffer The bytes array.
     */
    Crypto.toArrayBufferView = function (data) {
        var buffer = new ArrayBuffer(data.length);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < buffer.byteLength; i++) {
            view[i] = data.charCodeAt(i);
        }
        return view;
    };
    /**
     * Create base64 from byte data.
     *
     * @param data The byte data.
     * @return string The base64 encoded data.
     */
    Crypto.createBase64 = function (data) {
        var array = new Uint8Array(data);
        var rawString = '';
        for (var i = 0; i < array.byteLength; i++) {
            rawString += String.fromCharCode(array[i]);
        }
        return window.btoa(rawString);
    };
    Crypto.algRsaOaepSha1Key = { name: 'RSA-OAEP', hash: { name: 'SHA-1' } };
    Crypto.algHmacSha256Key = { name: 'HMAC', hash: { name: 'SHA-256' } };
    return Crypto;
}());
export { Crypto };
//# sourceMappingURL=data:application/json;base64,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VUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNZLHdCQUFpQixHQUFoQyxVQUFpQyxJQUFZO1FBQ3pDLElBQUksTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDWSxtQkFBWSxHQUEzQixVQUE0QixJQUFpQjtRQUN6QyxJQUFJLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUF2WGMsd0JBQWlCLEdBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO0lBQ3ZFLHVCQUFnQixHQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQztJQTZZdkYsYUFBQztDQS9ZRCxBQStZQyxJQUFBO1NBL1lZLE1BQU0iLCJmaWxlIjoiY3J5cHRvLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==