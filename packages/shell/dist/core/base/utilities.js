/* tslint:disable */
// this code has been worked on other platform, and refactoring may cause other problem so keeps as is.
var MsftSme;
(function (MsftSme) {
    'use strict';
    var global = window;
    var FunctionGlobal = Function;
    var MathGlobal = Math;
    var ObjectGlobal = Object;
    // See Mark Miller’s explanation of what this does.
    // http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
    //
    // For example:
    // const array_slice: <T>(target: T[]|IArguments, start?: number, end?: number) => T[] = MsPortalFx.uncurryThis(Array.prototype.slice);
    // Then the call can be strong typed, rather than call/apply with only runtime check.
    //
    // This also **might** have the nice side-effect of reducing the size of
    // the minified code by reducing x.call() to merely x()
    var call = FunctionGlobal.call;
    var apply = FunctionGlobal.apply;
    function uncurryThis(f) {
        return function () {
            return call.apply(f, arguments);
        };
    }
    MsftSme.uncurryThis = uncurryThis;
    var _applyCall = uncurryThis(apply);
    MsftSme.applyCall = _applyCall;
    MsftSme.applyUncurry = _applyCall; // most uncurry function can be call by _applyCall  except for array_concat; (see below.)
    // declare variable such that  minimize better and code readibility
    var array_prototype = Array.prototype;
    var array_prototype_concat = array_prototype.concat; // array concat does not work well with uncurryThis since it flatten the arguments array.
    var array_prototype_push = array_prototype.push;
    var array_filter = uncurryThis(array_prototype.filter);
    var array_forEach = uncurryThis(array_prototype.forEach);
    var array_join = uncurryThis(array_prototype.join);
    var array_push = uncurryThis(array_prototype_push);
    var array_slice = uncurryThis(array_prototype.slice);
    var array_splice = uncurryThis(array_prototype.splice);
    var array_indexof = uncurryThis(array_prototype.indexOf);
    var array_isArray = Array.isArray;
    var string_prototype = String.prototype;
    var string_concat = uncurryThis(string_prototype.concat);
    var string_split = uncurryThis(string_prototype.split);
    var string_substring = uncurryThis(string_prototype.substring);
    var string_indexOf = uncurryThis(string_prototype.indexOf);
    var string_toLowerCase = uncurryThis(string_prototype.toLowerCase);
    var object_hasOwnProperty = uncurryThis(ObjectGlobal.prototype.hasOwnProperty);
    var object_propertyIsEnumerable = uncurryThis(ObjectGlobal.prototype.propertyIsEnumerable);
    var object_keys_original = ObjectGlobal.keys;
    var _undefined = undefined;
    var object_freeze = ObjectGlobal.freeze;
    var functionType = "function";
    var stringType = "string";
    var numberType = "number";
    var objectType = "object";
    var undefinedType = "undefined";
    /**
     * For testing only. Use Object.keys.
     */
    function _objectKeysPolyfill(o) {
        switch (typeof o) {
            case stringType:
                var arr = [];
                for (var i in o) {
                    array_push(arr, i);
                }
                return arr;
            case functionType:
            case objectType:
            case undefinedType:
                return object_keys_original(o);
            default:// probably some other native type
                return [];
        }
    }
    MsftSme._objectKeysPolyfill = _objectKeysPolyfill;
    // intentionally put inside an anonymous function.
    // presense of try-catch impacts the browser's ability
    // to optimize code in the same function context.
    (function () {
        try {
            object_keys_original("");
        }
        catch (err) {
            // it threw so this browser is in ES5 mode (probably IE11)
            // let's polyfill Object.keys
            ObjectGlobal.keys = _objectKeysPolyfill;
        }
    })();
    var object_keys = ObjectGlobal.keys;
    function isTypeOf(obj, type) {
        return typeof obj === type;
    }
    function isDate(obj) {
        return obj instanceof Date;
    }
    function isFunction(obj) {
        return isTypeOf(obj, functionType);
    }
    MsftSme.isFunction = isFunction;
    function isNumber(obj) {
        return isTypeOf(obj, numberType);
    }
    MsftSme.isNumber = isNumber;
    var regex_NonSpace = /\S/;
    function getDisposeFunc(value) {
        var dispose = value && value.dispose;
        return isTypeOf(dispose, functionType) && dispose;
    }
    function forEachKey(obj, iterator) {
        array_forEach(object_keys(obj), function (k) {
            iterator(k, obj[k]);
        });
    }
    MsftSme.forEachKey = forEachKey;
    /**
     * Shortcut for Object.keys(obj || {}).length.
     * @return number.
     */
    function keysLength(obj) {
        return object_keys(obj || {}).length;
    }
    MsftSme.keysLength = keysLength;
    /**
     * Determines whether an object has properties on it.
     * Will return true for the following inputs: [], {}, "", 0, 1, true, false, new Date(), function() {}.
     * Will return false for the following inputs: [1], {a:1}, "123".
     * @return boolean.
     */
    function isEmpty(obj) {
        return !keysLength(obj);
    }
    MsftSme.isEmpty = isEmpty;
    /**
     * Detect a value is Disposable.
     *
     * @param value The value to check against value.dispose is a function.
     * @return boolean.
     */
    function isDisposable(value) {
        return !!getDisposeFunc(value);
    }
    MsftSme.isDisposable = isDisposable;
    function _disposeDisposable(value) {
        if (array_isArray(value)) {
            array_forEach(value, _disposeDisposable);
        }
        var dispose = getDisposeFunc(value);
        if (dispose) {
            dispose.call(value); //  dispose typically rely on this is the object.
        }
    }
    /**
     * call value.dispose() if a value is Disposable.
     *
     * @param value The value to call value.dispose()
     * @return boolean;
     */
    MsftSme.disposeDisposable = function () {
        array_forEach(arguments, _disposeDisposable);
    };
    /**
     * Detect a value is null.
     *
     * @param value The value to check against null.
     * @return boolean.
     */
    function isNull(value) {
        return value === null;
    }
    MsftSme.isNull = isNull;
    /**
     * Detect a value is undefined.
     *
     * @param value The value to check against undefined.
     * @return boolean.
     */
    function isUndefined(value) {
        return value === _undefined;
    }
    MsftSme.isUndefined = isUndefined;
    /**
     * Indicates whether the specified object is null or undefined.
     *
     * @param value The value to test.
     * @returns True if the value parameter is null or undefined; otherwise, false.
     */
    function isNullOrUndefined(value) {
        return value === null || value === _undefined;
    }
    MsftSme.isNullOrUndefined = isNullOrUndefined;
    /**
     * Indicates whether the specified object is not null or undefined.
     *
     * @param value The value to test.
     * @returns True if the value parameter is null or undefined; otherwise, false.
     */
    function notNullOrUndefined(value) {
        return value !== null && value !== _undefined;
    }
    MsftSme.notNullOrUndefined = notNullOrUndefined;
    /**
     * Checks if the string is null, undefined or whitespace.
     *
     * @param  value The target string.
     * @return true if the string is null, undefined or whitespace; otherwise, false.
     */
    function isNullOrWhiteSpace(value) {
        // http://jsperf.com/empty-string-test-regex-vs-trim/4
        return isNullOrUndefined(value) || (isTypeOf(value, stringType) && !regex_NonSpace.test(value)); // if can't find any characters other than space.
    }
    MsftSme.isNullOrWhiteSpace = isNullOrWhiteSpace;
    //#region Array
    /**
     * Firds the index of the first element of an array that matches the predicate.
     *
     * @param predicate The Predicate function.
     * @param startIndex The starting index.  If negative, it find from the end of the array.
     *        If you want to continue the next search from the back you much pass in startIndex = (prevReturn - length -1)
     *
     * @return The first index that matches the predicate.
     */
    function findIndex(array, predicate, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        if (array) {
            var length = array.length;
            var stop = length;
            var step = 1;
            var index = startIndex;
            if (length) {
                if (startIndex < 0) {
                    index += length;
                    step = stop = -1;
                }
                if (!predicate) {
                    return index < length && index >= 0 ? index : -1;
                }
                while (index !== stop) {
                    if (predicate(array[index], index, array)) {
                        return index;
                    }
                    index += step;
                }
            }
        }
        return -1;
    }
    MsftSme.findIndex = findIndex;
    /**
     * Finds the first element of an array that matches the predicate.
     *
     * @param predicate The Predicate function.
     * @param startIndex The starting index.  If negative, it find from the end of the array.
     *        If you want to continue the next search from the back you much pass in startIndex = (prevReturn - length -1)
     *
     * @return The first element that matches the predicate.
     */
    function find(array, predicate, startIndex) {
        var index = findIndex(array, predicate, startIndex);
        return index < 0 ? _undefined : array[index];
    }
    MsftSme.find = find;
    /**
     * Returns the first element of the sequence.
     *
     * @return The element
     */
    function first(array) {
        return array ? array[0] : _undefined;
    }
    MsftSme.first = first;
    /**
     * Returns the last element of the sequence.
     *
     * @return The element
     */
    function last(array) {
        var length = array ? array.length : 0;
        return length ? array[length - 1] : _undefined;
    }
    MsftSme.last = last;
    /**
     * Removes all values that equal the given item and returns them as an array
     *
     * @param item The value to be removed.
     * @return The removed items.
     */
    function remove(array, itemOrPredicate, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        var removedItems = [];
        var removedCount = 0;
        var predicate;
        if (isTypeOf(itemOrPredicate, functionType)) {
            predicate = itemOrPredicate;
        }
        for (var i = startIndex, l = array.length; i < l; i++) {
            var item = array[i];
            if (removedCount) {
                array[i - removedCount] = item; //shift the item to the offset
            }
            if (itemOrPredicate === item || (predicate && predicate(item))) {
                removedCount++;
                array_push(removedItems, item);
            }
        }
        if (removedCount) {
            array_splice(array, -1 * removedCount); // remove that many item form the end;
        }
        return removedItems;
    }
    MsftSme.remove = remove;
    // This function use findIndex, put it here for minimizer friendly
    // sourceUnique is a flag to optimize the performance, set to  true if you know source is unique already.
    function pushUnique(uniqueTarget, source, predicate, sourceUnique) {
        if (sourceUnique === void 0) { sourceUnique = false; }
        if (array_isArray(source)) {
            var getIndex = predicate ?
                function (value) { return findIndex(uniqueTarget, function (resultValue) { return predicate(resultValue, value); }); } :
                function (value) { return uniqueTarget.indexOf(value); };
            var appendTarget = (sourceUnique) ? [] : uniqueTarget; // if source is already unique, we accumlate to a sperated array to increase the perf.
            for (var i = 0, l = source.length; i < l; i++) {
                var value = source[i];
                if (getIndex(value) < 0) {
                    array_push(appendTarget, value);
                }
            }
            if (sourceUnique) {
                array_prototype_push.apply(uniqueTarget, appendTarget);
            }
        }
        return uniqueTarget;
    }
    MsftSme.pushUnique = pushUnique;
    /**
     * Returns a unique set from this array based on the predicate.
     *
     * @param predicate The predicate function. Added to the result if the predicate returns false.
     * @return A new array with the unique values.
     */
    function unique(array, predicate) {
        return pushUnique([], array, predicate);
    }
    MsftSme.unique = unique;
    function union() {
        var result = [];
        var lastArrayIndex = arguments.length - 2;
        var predicate = arguments[lastArrayIndex + 1];
        // If the predicate is not a function, it means that it is the last array to union.
        if (!isTypeOf(predicate, functionType)) {
            predicate = _undefined;
            lastArrayIndex++;
        }
        for (var i = 0; i <= lastArrayIndex; i++) {
            var source = unique(arguments[i], predicate); // make a smaller set
            pushUnique(result, source, predicate, true /* source Unique*/);
        }
        return result;
    }
    MsftSme.union = union;
    /**
     * Merge multiple T, T[] into a combine T[] exclude null or undefined arguments.
     *
     * @param data, a list fo T, T[]
     * @returns concattenated array.
     */
    MsftSme.merge = function () {
        // Don't use TypeScript's built-in "... rest" args syntax for perf-critical
        // paths because it constructs the args array even if you don't need it,
        var ret = [];
        var data = array_filter(arguments, notNullOrUndefined);
        return array_prototype_concat.apply(ret, data);
    };
    /**
     * Projects each element of a sequence to a sequence and flattens the resulting sequences into one sequence.
     *
     * @param selector The projection function.
     * @return A flattened array.
     */
    function mapMany(array, selector) {
        return MsftSme.merge.apply(null, array.map(selector));
    }
    MsftSme.mapMany = mapMany;
    /**
     * Sorts an array using a stable sort algorithm.
     *
     * This method returns a new array, it does not sort in place.
     *
     * @param compare The Compare function.
     * @return Sorted array.
     */
    function stableSort(array, compare) {
        var array2 = array.map(function (v, i) { return { i: i, v: v }; });
        array2.sort(function (a, b) {
            return compare(a.v, b.v) || (a.i - b.i);
        });
        return array2.map(function (v) { return v.v; });
    }
    MsftSme.stableSort = stableSort;
    function toString(item) {
        return item ? item.toString() : String(item);
    }
    function extendArrayIntoMap(objToExtend, sourceItems, getKeyCallback, getValueCallback, onlyIfNotExist) {
        getKeyCallback = getKeyCallback || toString;
        // The use of args here is to reduce the array creation call and make sure the function context this is the sourceItems.
        var args = [sourceItems, /*item*/ , /*index*/ , ""];
        for (var i = 0, l = sourceItems.length; i < l; i++) {
            var item = sourceItems[i];
            args[1] = item;
            args[2] = i;
            args[3] = _undefined;
            var key = call.apply(getKeyCallback, args);
            if (!onlyIfNotExist || objToExtend[key] === _undefined) {
                args[3] = key; // This is convient for the get value function to know the key that previous interpreted by getKeyCallback
                var value = getValueCallback ? call.apply(getValueCallback, args) : item;
                // Only extend this key if the value return is not undefined.
                if (value !== _undefined) {
                    objToExtend[key] = value;
                }
            }
        }
    }
    MsftSme.extendArrayIntoMap = extendArrayIntoMap;
    function extendStringMapIntoMap(objToExtend, sourceItems, getValueCallback, onlyIfNotExist) {
        // The use of args here is to reduce the array creation call and make sure the function context this is the sourceItems.
        var args = [sourceItems, /*item*/ ,];
        forEachKey(sourceItems, function (key, item) {
            if (!onlyIfNotExist || objToExtend[key] === _undefined) {
                args[1] = item;
                args[2] = key; // This is convient for the get value function to know the key that previous interpreted by getKeyCallback
                var value = getValueCallback ? call.apply(getValueCallback, args) : (item || key);
                // Only extend this key if the value return is not undefined.
                if (value !== _undefined) {
                    objToExtend[key] = value;
                }
            }
        });
    }
    MsftSme.extendStringMapIntoMap = extendStringMapIntoMap;
    function getStringMapFunc(keys) {
        if (array_isArray(keys)) {
            // make a copy of keys so that future changes to the input array do not impact the behavior of the returned function.
            keys = array_slice(keys);
        }
        else {
            keys = arguments;
        }
        return function () {
            // Most people call .hasOwnProperty or .constructor (which it should not)
            // since there is no guarantee that any object return to have those function -Expecially in generic function.
            // http://stackoverflow.com/questions/12017693/why-use-object-prototype-hasownproperty-callmyobj-prop-instead-of-myobj-hasow
            // Unfortunately, this need to be changed.
            var ret = {};
            array_forEach(arguments, function (value, index) {
                var key = keys[index];
                if (value !== _undefined) {
                    ret[key] = value;
                }
            });
            return ret;
        };
    }
    MsftSme.getStringMapFunc = getStringMapFunc;
    /**
     * Helpers funciton to create a object lightweight constructor
     *
     * @param keys the ordered argument keys
     *
     * @return The function that will return string map base on the arguments index order of keys
     */
    function applyStringMapFunc(keys) {
        return getStringMapFunc.apply(_undefined, keys);
    }
    MsftSme.applyStringMapFunc = applyStringMapFunc;
    /**
     * Helpers funciton to create a object of type NameValue<N, T>
     *
     * @param name name
     * @param value value
     *
     * @return an object of NameValue<N, T>
     */
    MsftSme.getNameValue = getStringMapFunc("name", "value");
    /**
     * Get a list of typeScript Enum into Array
     *
     * @param tsEnumeration The Type script Enum Array
     * @param sort optional whether to sort by enum's value
     * @return all NameValue<string, number>[] for this typeScriptEnum
     */
    function getEnumArray(tsEnumeration, sort) {
        var retVal = [];
        forEachKey(tsEnumeration, function (key, val) {
            if (isTypeOf(key, stringType) && isTypeOf(val, numberType)) {
                array_push(retVal, MsftSme.getNameValue(key, val));
            }
        });
        return sort ? retVal.sort(function (a, b) { return a.value - b.value; }) : retVal;
    }
    MsftSme.getEnumArray = getEnumArray;
    /**
     * Coerce an input into an array if it isn't already one.
     */
    function makeArray(input) {
        if (!array_isArray(input)) {
            if (isNullOrUndefined(input)) {
                input = [];
            }
            else {
                input = [input];
            }
        }
        return input;
    }
    MsftSme.makeArray = makeArray;
    //#endregion Array
    //#region Date
    /**
     * Checks if given dates are equal.
     *
     * @param left Left hand side date.
     * @param left Right hand side date.
     * @return True if left date is equal to right date.
     */
    function areEqualDates(left, right) {
        return isDate(left) && isDate(right) && !(left > right || left < right);
    }
    MsftSme.areEqualDates = areEqualDates;
    /**
     * Round down the date.getTime() to seconds
     *
     * @param date.
     * @return the getTime in seconds
     */
    function toSeconds(date) {
        // The old function use toString to trim off microseconds to time comparsion for stablesort
        // return new Date(x.toString()).getTime();  --- this is slow:
        // http://jsperf.com/truncating-decimals
        // x = new Date()
        //Wed Feb 17 2016 12:15:39 GMT- 0800(Pacific Standard Time)
        //y = new Date(x.toString()).getTime()
        //1455740139000
        //z = (x.getTime() / 1000) | 0
        //1455740139
        return (date.getTime() / 1000) | 0;
    }
    MsftSme.toSeconds = toSeconds;
    //#endregion Date
    //#region Math
    var hexCharsLowerCase = string_split("0123456789abcdef", "");
    var hexBytesLower = [];
    array_forEach(hexCharsLowerCase, function (upper) {
        array_forEach(hexCharsLowerCase, function (lower) {
            array_push(hexBytesLower, upper + lower);
        });
    });
    var sizeOfGuidInBytes = 20;
    var tempUintArray = new Uint8Array(sizeOfGuidInBytes);
    var tempStringArray = new Array(sizeOfGuidInBytes);
    function applyAndOr(index, and, or) {
        var temp = tempUintArray[index] & and;
        tempUintArray[index] = temp | or;
    }
    ////// TODO: const globalCrypto = <Crypto>(window.crypto || (<any>window).msCrypto);
    var globalCrypto = (window.crypto || window.msCrypto);
    // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    //  xx  xx  xx  xx  -   xx  xx  -  4x  xx  -   yx  xx  -   xx  xx  xx  xx  xx  xx
    //  00  11  22  33  4   55  66  7  88  99  10  11  12  13  14  15  16  17  18  19
    function newGuidCrypto() {
        globalCrypto.getRandomValues(tempUintArray);
        applyAndOr(8, 0x0F, 0x40); // set upper half of the 8th byte to 0x4
        applyAndOr(11, 0x3F, 0x80); // set the two most significant bits of the 11th byte to 10b
        for (var i = 0; i < sizeOfGuidInBytes; i++) {
            tempStringArray[i] = hexBytesLower[tempUintArray[i]];
        }
        tempStringArray[4] = tempStringArray[7] = tempStringArray[10] = tempStringArray[13] = "-";
        return MsftSme.applyUncurry(string_concat, "", tempStringArray);
    }
    /**
     * HelperReturns hex number string.
     *
     * @param len The number of the output string length
     * @return a hexnumber string of length len
     */
    function getRandomHexString(len) {
        var tmp;
        var ret = new Array(len);
        // This implementation optimization of speed mimimize the cost of Math.random.
        // equal chance for all number
        while (len) {
            tmp = 4294967296 * MathGlobal.random() | 0; // get the max integer our of 32 digit.
            var times = 8; // for every random number we can harvest 8 times.
            while (times--) {
                ret[--len] = hexCharsLowerCase[tmp & 0xF]; // fill from the back.
                if (len < 0) {
                    return ret; // we filled all the bucket, return now.
                }
                tmp >>>= 4; // zero fill right shift to ensure return is always positive number.
            }
        }
    }
    function newGuidFallback() {
        // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
        var guid = getRandomHexString(36);
        guid[8] = guid[13] = guid[18] = guid[23] = "-"; // fill in the dash.
        guid[14] = "4"; // set the 4 in the guid.
        // "Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively"
        // guid[19] = hexValues[8 + (Math.random() * 4) | 0]; /*clockSequenceHi*/
        guid[19] = hexCharsLowerCase[8 + (hexCharsLowerCase.indexOf(guid[19]) & 0x3)]; // Since guid[19] is already random. reused the numbe by get its index rather than another Math.random call.
        return _applyCall(string_concat, "", guid);
    }
    /**
     * Returns a GUID such as xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
     *
     * @return New GUID.
     */
    MsftSme.newGuid = globalCrypto ? newGuidCrypto : newGuidFallback;
    var maxCounter = 0xFFF;
    function toHexString(counter) {
        return hexBytesLower[counter >> 4] + hexCharsLowerCase[counter & 0xF];
    }
    /**
     * Returns a function that can generate globally unique identifiers.
     * Generates a new guid every 4096 calls and concatenates it with an
     * auto incrementing number.  This maintains a complient GUID 4 format
     * if no prefix is added.
     *
     * @return a globally unique string generating function.
     */
    function getUniqueIdGenerator(prefix) {
        prefix = prefix ? (prefix + "-") : "";
        // use a range for counter that gives us 3 digits with minimum effort
        var guid = "";
        var counter = maxCounter;
        return function () {
            if (++counter > maxCounter) {
                counter = 0;
            }
            if (!counter) {
                guid = prefix + MsftSme.newGuid().substring(0, 33);
            }
            return guid + toHexString(counter);
        };
    }
    MsftSme.getUniqueIdGenerator = getUniqueIdGenerator;
    /**
     * Returns a function that can generate unique id under the prefix
     * Concatenates prefix with an auto incrementing number.
     *
     * @return a unique string generating function which return a prefix with auto incrementing number
     */
    function getIdGenerator(prefix) {
        // use two counters and
        // limit the size of the lower counter because
        // toString is expensive for large numbers
        var counterUpper = -1;
        var counterLower = maxCounter;
        var realPrefix = "";
        return function () {
            if (++counterLower > maxCounter) {
                counterLower = 0;
                counterUpper++;
                realPrefix = prefix + counterUpper.toString(16) + "-";
            }
            return realPrefix + toHexString(counterLower);
        };
    }
    MsftSme.getIdGenerator = getIdGenerator;
    /**
     * Returns a globally unique identifier string.
     * Lighter-weight than newGuid.
     *
     * @return a globally unique string.
     */
    MsftSme.getUniqueId = getUniqueIdGenerator();
    /**
     * Rounds a number to the specified precision.
     *
     * @param number The number to round.
     * @param precision The precision to round the number to. Defaults to 0.
     * @returns The rounded number.
     */
    function round(number, precision) {
        precision = MathGlobal.pow(10, precision || 0);
        return MathGlobal.round(Number(number) * precision) / precision;
    }
    MsftSme.round = round;
    /**
     * Truncates a number to the integer part.
     *
     * @param value The number to truncate.
     * @return The integer number.
     */
    function truncate(value) {
        // Converts to integer by bit operation
        return value | 0;
    }
    MsftSme.truncate = truncate;
    /**
     * Returns the result of the boolean exclusive-or operator.
     *
     * @param a First operand.
     * @param b Second operand.
     * @return true if the arguments have different values, false otherwise.
     */
    function xor(a, b) {
        return a ? !b : b;
    }
    MsftSme.xor = xor;
    //#endregion Map
    //#region Number
    /**
     * Generates a random integer between min and max inclusive.
     *
     * @param min The minimum integer result.
     * @param max The maximum integer result.
     * @return A random integer.
     */
    function random(min, max) {
        if (min === _undefined || max === _undefined || min > max) {
            return;
        }
        return MathGlobal.floor(MathGlobal.random() * (max - min + 1)) + min;
    }
    MsftSme.random = random;
    //#endregion Number
    //#region Object
    /**
     * Determines whether an object has a property with the specified name.
     * @param target the object to check.
     * @param v A property name.
     */
    MsftSme.hasOwnProperty = object_hasOwnProperty;
    /**
     * Determines whether an object has an enumerable property with the specified name.
     * @param target the object to check.
     * @param v A property name.
     */
    MsftSme.propertyIsEnumerable = object_propertyIsEnumerable;
    /**
     * Returns a boolean reflecting whether two scalar values (not object-typed, not array-typed, not function-typed)
     * are equal.  Accounts for the fact that JavaScript Date derives from Object.
     * The caller is responsible for supplying exclusively number-, string- or Date-typed values here.
     *
     * @param left The first scalar value.
     * @param right The second scalar value.
     * @return A boolean reflecting whether the two scalar values are equal.
     */
    function areEqual(left, right) {
        return left === right || areEqualDates(left, right);
    }
    MsftSme.areEqual = areEqual;
    /**
     * Verifies that two arrays are equal.
     *
     * @param array1 The array to check.
     * @param array2 The array to compare the first array to.
     * @returns A value indicating whether or not the two arrays are equal.
     */
    function arrayEquals(array1, array2) {
        if (array1 === array2) {
            return true;
        }
        else if (!array1 || !array2) {
            return false;
        }
        else if (array1.length !== array2.length) {
            return false;
        }
        else {
            for (var i = 0; i < array1.length; i++) {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }
            return true;
        }
    }
    MsftSme.arrayEquals = arrayEquals;
    function getTypeOf(x) {
        var typeOfX = typeof x;
        if (typeOfX === objectType) {
            if (x === null) {
                typeOfX = "null";
            }
            else if (array_isArray(x)) {
                typeOfX = "array";
            }
            else if (isDate(x)) {
                typeOfX = "date";
            }
        }
        return typeOfX;
    }
    MsftSme.getTypeOf = getTypeOf;
    /**
    * Checks for deep equality of two object.
    *
    * @param a Object 1
    * @param b Object 2
    * @param mapFunc Optional parameter, used convert value conversion use on the value to compare
    * @return true if both of the object contains the same information; false otherwise;
    */
    function deepEqualsMap(a, b, mapFunc) {
        var i;
        if (mapFunc) {
            a = mapFunc(a);
            b = mapFunc(b);
        }
        if (a === b) {
            return true;
        }
        else if (!a || !b) {
            return false;
        }
        var typeofInput = getTypeOf(a);
        if (typeofInput !== getTypeOf(b)) {
            return false;
        }
        switch (typeofInput) {
            case "array":
                var aArray = a;
                return a.length === b.length &&
                    aArray.every(function (v, index) { return deepEqualsMap(v, b[index], mapFunc); });
            case "date":
                return a.getTime() === b.getTime();
            case objectType:
                var keysOfInput = object_keys(a);
                return keysOfInput.length === keysLength(b) &&
                    keysOfInput.every(function (key) { return deepEqualsMap(a[key], b[key], mapFunc); });
            default:
                // basic type that failed the === check
                return false;
        }
    }
    /**
     * Checks if a given value is a javascript object or not.
     *
     * @param value Value to test.
     * @return True if value is an object, false otherwise.
     */
    function isObject(value) {
        return typeof value === objectType;
    }
    MsftSme.isObject = isObject;
    /**
     * Checks if a given value is a plain object or not.
     *
     * @param value Value to test.
     * @return True if value is an object, false otherwise.
     */
    function isPlainObject(value) {
        return getTypeOf(value) === objectType;
    }
    MsftSme.isPlainObject = isPlainObject;
    /**
     * Maps each value of the input object. Values that map to null or undefined are skipped.
     *
     * @param obj Input object whose properties are to be mapped.
     * @param callback Invoked for each property of the object to perform the mapping.
     * @param arg An Optional value that can be passed to callback.
     * @return An array of mapped values.
     */
    function map(obj, callback, arg) {
        var callBackArgs = [obj, /*item*/ , /*key*/ , arg];
        var keys = object_keys(obj);
        var ret = keys.map(function (key) {
            callBackArgs[1] = obj[key]; // item;
            callBackArgs[2] = key; // key;
            return call.apply(callback, callBackArgs);
        });
        // Flatten any nested arrays and exclude null, undefined items.
        return MsftSme.merge.apply(null, ret);
    }
    MsftSme.map = map;
    /**
     * Shallow copy from a key/value pairs object.
     *
     * @param to An un-typed object to be populated.
     * @param from An un-typed object with values to populate.
     * @param scopes Scoped down the list for shallowCopy
     */
    function shallowCopyFromObject(to, from, scopes) {
        // http://jsperf.com/shallowcopyobjects/3
        scopes = scopes || object_keys(from);
        for (var i = 0; i < scopes.length; i++) {
            var key = scopes[i];
            var value = from[key];
            if (value !== _undefined) {
                to[key] = value;
            }
        }
    }
    MsftSme.shallowCopyFromObject = shallowCopyFromObject;
    /**
     * Merges a property from a destination object from a source object
     * @param dest The destination object
     * @param src The source object
     * @param propName The name of the property to assign
     */
    function deepAssignProperty(dest, src, propName) {
        var value = src[propName];
        // if there is no value, dont assign.
        if (isNullOrUndefined(value)) {
            return;
        }
        if (!isObject(value) || !MsftSme.hasOwnProperty(dest, propName)) {
            // If the src prop is not an object or the prop is not defined on the dest then set the prop directly
            dest[propName] = value;
        }
        else {
            // Otherwise merge to src prop with the dest prop
            dest[propName] = deepAssignInternal(dest[propName], src[propName]);
        }
    }
    /**
     * Internal method for merging one object with another
     * @param dest The destination object
     * @param src The source object
     */
    function deepAssignInternal(dest, src) {
        // if the to destination is the same object as the source, save some time by just returning
        if (dest === src) {
            return dest;
        }
        // loop through the src objects properties and merge them deeply to the dest
        for (var propName in src) {
            if (MsftSme.hasOwnProperty(src, propName)) {
                deepAssignProperty(dest, src, propName);
            }
        }
        // loop through the src symbols properties and merge them deeply to the dest
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(src);
            symbols.forEach(function (symbol) {
                if (MsftSme.propertyIsEnumerable(src, symbol)) {
                    deepAssignProperty(dest, src, symbol);
                }
            });
        }
        // return the destination object
        return dest;
    }
    /**
     * Merges a set of source objects to a destination object
     * @param dest The destination object
     * @param sources  the source objects
     */
    function deepAssign(dest) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        // merge all sources into the dest object in order
        sources.forEach(function (src) {
            return deepAssignInternal(dest, src);
        });
        // return the dest object
        return dest;
    }
    MsftSme.deepAssign = deepAssign;
    /**
     * Searchs an object for a value at a given path.
     * @param object The object to search in
     * @param path the path to walk
     * @param replace internal use, indicates that this is the first pass.
     * @returns the object at the end of the path
     */
    function getValueInternal(object, path, firstPass) {
        // return null if either argument is not provided
        if (isNullOrUndefined(object) || isNullOrUndefined(path)) {
            return null;
        }
        // always convert path to string
        var strPath = '' + path;
        // on the first pass, replace delimiters in the object path with *
        if (firstPass) {
            strPath = strPath.replace(/\]\.|\.|\[|\]/g, "*");
        }
        // find the next delimiter
        var index = strPath.indexOf('*');
        // if there are no more delimiters, return the object at the path
        if (index === -1) {
            return object[strPath];
        }
        // split the path at the delimiter. Use the first segment as our next object and the second segment for the remaing path
        var next = strPath.slice(0, index);
        var remainingPath = strPath.slice(index + 1);
        if (object[next] !== undefined && remainingPath.length > 0) {
            // dive in recursively to the next object
            return getValueInternal(object[next], remainingPath, false);
        }
        // we found our target object. Return it
        return object[next];
    }
    /**
     * Searchs an object for a value at a given path.
     * @param object The object to search in
     * @param path the path to walk
     * @returns the object at the end of the path
     */
    function getValue(object, path) {
        // call our internal get value function
        return getValueInternal(object, path, true);
    }
    MsftSme.getValue = getValue;
    //#endregion Object
    //#region String
    /**
     * Determines if the current string ends with the given string.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
     * http://jsperf.com/string-prototype-endswith/18
     *
     * @param input The input string.
     * @param searchString The characters to be searched for at the end of this string.
     * @param position Optional. Search within this string as if this string were only this long; defaults to this string's actual length, clamped within the range established by this string's length.
     * @return A value indicating whether or not the input string ends with the search string.
     */
    function endsWith(input, searchString, position) {
        if (!isTypeOf(searchString, stringType)) {
            return false;
        }
        input = isNullOrUndefined(input) ? "" : String(input);
        var strLen = input.length;
        if (position === _undefined || position > strLen) {
            position = strLen;
        }
        position -= searchString.length;
        var lastIndex = string_indexOf(input, searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    }
    MsftSme.endsWith = endsWith;
    /**
     * Compares the current string to another string and returns a value indicating their relative ordering.
     *
     * @param input The input string to compare.
     * @param other The value to compare the input string to.
     * @param locales The optional array of locale values that will be passed to localeCompare.
     * @param options The options supported by localeCompare.
     * @return 0, if the strings are equal; a negative number if the current string is ordered before value; a positive non-zero number if the current string is orered after value.
     */
    function localeCompareIgnoreCase(input, other, locales, options) {
        if (isNullOrUndefined(input)) {
            return -1;
        }
        if (!isTypeOf(other, stringType)) {
            return 1;
        }
        return input.toLocaleLowerCase().localeCompare(other.toLocaleLowerCase(), locales, options);
    }
    MsftSme.localeCompareIgnoreCase = localeCompareIgnoreCase;
    /**
     * Repeats the string the specified number of times.
     * @param input The input string.
     * @param count The number of times to repeat the string.
     * @returns The result string.
     *  http://jsperf.com/repeatstring2
     */
    function repeat(input, count) {
        var ret = "";
        count = (count < 0) ? 0 : count;
        while (count--) {
            ret += input;
        }
        return ret;
    }
    MsftSme.repeat = repeat;
    /**
     * reverse the string.
     * @param input The input string.
     * @returns The result string.
     */
    function reverse(input) {
        var ret = "";
        var length = input.length;
        while (length) {
            ret += input[--length];
        }
        return ret;
    }
    MsftSme.reverse = reverse;
    /**
     * Return a function that will perform join with that separator
     *
     * @returns a function that will join the parts together with the character, for example.
     *   joinPaths = getJoinFunc("/");
     *   joinByDash = getJoinFunc("-");
     *
     *  joinPaths("a", "b", "c") will return  "a/b/c";
     *  joinByDash("a", "b", "c") will return  "a-b-c";
     */
    function getJoinFunc(sep) {
        return function () {
            return array_join(arguments, sep);
        };
    }
    MsftSme.getJoinFunc = getJoinFunc;
    ;
    /**
     * Return a function that will perform quote the input.  (Mimizer helper).
     *
     * @returns a function that will join the parts together with the character(s).
        For example.
            quote = getQuoteFunc("'");
            parenthesis = getQuoteFunc("(", ")");
            poMarker = getQuoteFunc("####");
     *
     * quote("abc") will return "'abc'";
     * parenthesis("abc") will reutrn "(abc)";
     * poMarker("abc") will return "####abc####";
     */
    function getQuoteFunc(prefix, suffix) {
        prefix = prefix || "";
        suffix = suffix || prefix;
        return function (input) {
            return prefix + input + suffix;
        };
    }
    MsftSme.getQuoteFunc = getQuoteFunc;
    ;
    /**
     * Replaces all instances of a value in a string.
     *
     * @param input The input string.
     * @param searchValue The value to replace.
     * @param replaceValue The value to replace with.
     * @return A new string with all instances of searchValue replaced with replaceValue.
     */
    function replaceAll(input, searchValue, replaceValue) {
        return input.replace(new RegExp(regexEscape(searchValue), "g"), replaceValue);
    }
    MsftSme.replaceAll = replaceAll;
    /**
     * Replaces multiple instances of search values and replacement values in a string.
     *
     * @param input The input string.
     * @param replacementMap A string map where each key represents the string to replace, and that key's value represents the value to replace it with.
     * @return A new string with replacementMap values replaced.
     */
    function replaceMany(input, replacementMap) {
        var escapedMap = {}, hasValuesToReplace = false;
        for (var searchValue in (replacementMap || {})) {
            if (replacementMap.hasOwnProperty(searchValue)) {
                escapedMap[regexEscape(searchValue)] = replacementMap[searchValue];
                hasValuesToReplace = true;
            }
        }
        if (!hasValuesToReplace) {
            return input;
        }
        var regex = new RegExp(object_keys(escapedMap).join("|"), "g");
        return input.replace(regex, function (match) { return replacementMap[match]; });
    }
    MsftSme.replaceMany = replaceMany;
    /**
     * Splits a string into the specified number of parts.
     * Differs from string.split in that it leaves the last part containing the remaining string (with separators in it).
     * string.split truncates the extra parts.
     * @param input The string to be split.
     * @param separator A string that identifies the character or characters to be used as the separator.
     * @param limit A value used to limit the number of elements returned in the array.
     * @return An array of strings whose length is at most the value of limit.
     */
    function split(input, separator, limit) {
        var retVal = [];
        if (input && separator && limit) {
            var startIndex = 0;
            var seplength = separator.length;
            var indexOf = 0;
            // reduce the limit by one.
            // we'll only break the string into limit - 1 parts
            // and put the remaining in the last spot.
            limit--;
            while (true) {
                if (retVal.length >= limit || // only one spot left in the array. push remaining string into array and exit.
                    (indexOf = string_indexOf(input, separator, startIndex)) < 0) {
                    array_push(retVal, string_substring(input, startIndex));
                    break;
                }
                array_push(retVal, string_substring(input, startIndex, indexOf));
                startIndex = indexOf + seplength;
            }
        }
        return retVal;
    }
    MsftSme.split = split;
    /**
     * Determines if the current string starts with the given string.
     * http://jsperf.com/string-startswith/49
     *
     * @param input The input string.
     * @param searchString The characters to be searched for at the start of this string.
     * @param position Optional. The position in this string at which to begin searching for searchString; defaults to 0.
     * @return A value indicating whether or not the input string begins with the search string.
     */
    function startsWith(input, searchString, position) {
        input = isNullOrUndefined(input) ? "" : String(input);
        position = (isNullOrUndefined(position) || position < 0) ? 0 : MathGlobal.min(position, input.length);
        return input.lastIndexOf(searchString, position) === position;
    }
    MsftSme.startsWith = startsWith;
    /**
     * Trims all occurrences of the given set of strings off the end of the input.
     */
    function trimEnd(input) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        input = input || "";
        while (input) {
            var match = values.first(function (value) {
                return value && endsWith(input, value);
            });
            if (!match) {
                break;
            }
            input = string_substring(input, 0, input.length - match.length);
        }
        return input;
    }
    MsftSme.trimEnd = trimEnd;
    /**
     * Trims all occurrences of the given set of strings off the start of the input.
     */
    function trimStart(input) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        input = input || "";
        while (input) {
            var match = values.first(function (value) {
                return value && startsWith(input, value);
            });
            if (!match) {
                break;
            }
            input = string_substring(input, match.length);
        }
        return input;
    }
    MsftSme.trimStart = trimStart;
    /**
     * Ensures that the given string ends with the suffix provided.
     * If it already does, it just returns the input string.
     * If it does not, then the suffix is appended and the result is returned.
     */
    function ensureSuffix(input, suffix) {
        input = input || "";
        if (!endsWith(input, suffix)) {
            input += suffix;
        }
        return input;
    }
    MsftSme.ensureSuffix = ensureSuffix;
    /**
     * Ensures that the given string starts with the prefix provided.
     * If it already does, it just returns the input string.
     * If it does not, then the prefix is applied and the result is returned.
     */
    function ensurePrefix(input, prefix) {
        input = input || "";
        if (!startsWith(input, prefix)) {
            input = prefix + input;
        }
        return input;
    }
    MsftSme.ensurePrefix = ensurePrefix;
    function pathJoin(pathSeparator, pathComponents) {
        if (!array_isArray(pathComponents)) {
            pathComponents = array_slice(arguments, 1);
        }
        var output = "";
        array_forEach((pathComponents || []), function (current) {
            if (!output) {
                output = current || "";
            }
            else if (current) {
                output = trimEnd(output, pathSeparator) + ensurePrefix(current, pathSeparator);
            }
        });
        return output;
    }
    MsftSme.pathJoin = pathJoin;
    //#endregion String
    //#region Browser
    function isInternetExplorer() {
        // IE Agent Example:
        // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko"
        var agent = window.navigator.userAgent;
        return agent.indexOf('Trident') > 0;
    }
    MsftSme.isInternetExplorer = isInternetExplorer;
    function isEdge() {
        // Microsoft Edge Agent Example:
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
        var agent = window.navigator.userAgent;
        // We should be able to reliably detect Microsoft Edge using the useragent, because there isn't any browser out there trying to pretend to be Microsoft Edge.
        return /\bEdge\b/.test(agent);
    }
    MsftSme.isEdge = isEdge;
    //#endregion Browser
    //#region Uri
    /**
     * Parse an uri and return the Authority of the uri.
     *
     * @param uri The string of uri.
     * @return Authority of the uri.
     */
    function getUriAuthority(uri, includePort) {
        if (includePort === void 0) { includePort = true; }
        // If uri starts with "//" or "https://" or "http://", authority will start after that.
        // Otherwise authority starts from very beginning.
        // Authority will end before one of those characters "?/#" or end of string.
        if (!uri) {
            return uri;
        }
        if (startsWith(uri, "//")) {
            uri = string_substring(uri, index + 2);
        }
        else {
            var index = string_indexOf(uri, "://");
            if (index > -1) {
                uri = string_substring(uri, index + 3);
            }
        }
        var endChars = includePort ? /[?#/]/ : /[?#/:]/;
        var endIndex = uri.search(endChars);
        endIndex = endIndex > -1 ? endIndex : uri.length;
        return string_substring(uri, 0, endIndex);
    }
    MsftSme.getUriAuthority = getUriAuthority;
    /**
     * Verify if one Url is subdomain of another Url.
     *
     * @param domain The string of domain.
     * @param subdomain The string of subdomain
     * @return True if subdomain is subdomain of domain.
     */
    function isSubdomain(domain, subdomain) {
        if (!domain || !subdomain || domain.length < subdomain.length) {
            return false;
        }
        var lowerCaseDomain = string_toLowerCase(domain);
        var lowerCaseSubdomain = string_toLowerCase(subdomain);
        return (lowerCaseDomain === lowerCaseSubdomain) || endsWith(lowerCaseDomain, "." + lowerCaseSubdomain);
    }
    MsftSme.isSubdomain = isSubdomain;
    /**
     * Returns whether the given URI is an absolute URI.
     *
     * @param uri The URI.
     * @return A boolean value indicating whether the URI is absolute.
     */
    function isUriAbsolute(uri) {
        return string_indexOf(uri, "://") !== -1 || startsWith(uri, "//");
    }
    MsftSme.isUriAbsolute = isUriAbsolute;
    //#endregion Uri
    /**
     * Escapes regular expression special characters -[]/{}()*+?.\^$|
     *
     * @param str The string to escape.
     * @return The escaped string.
     */
    function regexEscape(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    MsftSme.regexEscape = regexEscape;
    /**
     * No-op function.
     */
    MsftSme.noop = function () {
    };
    var primitiveTypes = {};
    array_forEach(["boolean", undefinedType, numberType, stringType, "symbol"], function (item) { primitiveTypes[item] = true; });
    /**
     * Returns whether the given data is primitive data type.
     * ECMAScript 6 standard defines 6 primitive data types: Boolean, Null, Undefined, Number, String, Symbol(new in ECMAScript 6)
     *
     * @param data The input data.
     * @return A boolean value indicating whether the data is primitive data type.
     */
    function isPrimitive(data) {
        return data === null || typeof data in primitiveTypes;
    }
    MsftSme.isPrimitive = isPrimitive;
    /**
     * Applies polyfills as properties to the prototype of the given object.
     * If force is specified the polyfills will overwrite any existing properties.
     */
    function polyfill(type, fills, force) {
        var proto = type.prototype;
        forEachKey(fills, function (funcName, func) {
            if (force || !proto[funcName]) {
                ObjectGlobal.defineProperty(proto, funcName, {
                    value: func,
                    configurable: true,
                    enumerable: false,
                    writable: true
                });
            }
        });
    }
    MsftSme.polyfill = polyfill;
    var mapSupportedMaxInteger = 50;
    var intToStringMap = [];
    var stringToIntMap = {};
    for (var index = 0; index <= mapSupportedMaxInteger; index++) {
        var strVal = index + "";
        intToStringMap[index] = strVal;
        stringToIntMap[strVal] = index;
    }
    function validateRequiredMaxInteger(requiredMaxInteger) {
        if (requiredMaxInteger > mapSupportedMaxInteger) {
            throw new Error("The requiredMaxInteger(" + requiredMaxInteger + ") should be less than " + mapSupportedMaxInteger);
        }
        if (requiredMaxInteger <= 0) {
            throw new Error("The requiredMaxInteger(" + requiredMaxInteger + ") should be greater than zero.");
        }
    }
    /**
     * Get a readonly map that is a faster alternative to cast a string to small and non-negative integers.
     * - Doesn't support negative integer since the performance is significantly decreased for negative integer.
     * - The JSperf links: http://jsperf.com/int-to-string-map/4, http://jsperf.com/cast-int-to-string-in-loop.
     *
     * The StringToIntMap is mainly used to convert string to const enum. For example:
     * const enum Fruit {
     *   Unknown = 0,
     *   Apple = 1,
     *   Banana = 2,
     *   Max = 3
     * }
     * var stringToIntMap = utilities.getStringToIntMap(Fruit.Max);
     * strictEqual(stringToIntMap["1"], Fruit.Apple);
     * strictEqual(stringToIntMap["2"], Fruit.Banana);
     *
     * @param requiredMaxInteger The required max integer.
     * @returns The object have one to one mapping between the string and the corresponding integer. e.g. {"0":0,"1":1,"2":2,"3":3,"4":4, ... }.
     */
    function getIntToStringMap(requiredMaxInteger) {
        validateRequiredMaxInteger(requiredMaxInteger);
        return intToStringMap;
    }
    MsftSme.getIntToStringMap = getIntToStringMap;
    /**
     * Get a readonly map that is a faster alternative to cast a small and non-negative integer to string.
     * - Doesn't support negative integer since the performance is significantly decreased for negative integer.
     * - The JSperf links: http://jsperf.com/parseint-vs-map-lookup/2, http://jsperf.com/parseint-vs-map-lookup-2
     *
     * The intToStringMap is mainly used to convert const enum to string. For example:
     * const enum Fruit {
     *     Unknown = 0,
     *     Apple = 1,
     *     Banana = 2,
     *     Max = 3
     * }
     *
     * var stringToIntMap = utilities.getStringToIntMap(Fruit.Max);
     * strictEqual(intToStringMap[Fruit.Unknown], "0");
     * strictEqual(intToStringMap[Fruit.Apple], "1");
     *
     * @param requiredMaxInteger The required max integer.
     * @returns The array to have increment integer in string representation. e.g. ["0","1","2","3","4", ...].
     */
    function getStringToIntMap(requiredMaxInteger) {
        validateRequiredMaxInteger(requiredMaxInteger);
        return stringToIntMap;
    }
    MsftSme.getStringToIntMap = getStringToIntMap;
    /**
     * Makes a shallow clone of the source object with the same prototype and rebinds all functions
     * on the clone to use the source object as 'this'.
     *
     * @param object The source object.
     * @return The cloned object.
     */
    function cloneAndRebindFunctions(object) {
        var clone = ObjectGlobal.create(ObjectGlobal.getPrototypeOf(object));
        for (var key in object) {
            var value = object[key];
            if (isTypeOf(value, functionType)) {
                clone[key] = value.bind(object); // This preserves ko_isObservable(value).
            }
            else if (object_hasOwnProperty(object, key)) {
                clone[key] = value;
            }
        }
        return clone;
    }
    MsftSme.cloneAndRebindFunctions = cloneAndRebindFunctions;
    function toLowerCaseOnlyWithValue(value) {
        return value && value.toLowerCase();
    }
    /**
     * Takes a value and lower cases recursively.
     * For a string, returns the lower case string (non-value remains non-value).
     * For an object, recursively converts all string properties to lower case strings, including arrays of values.
     * For an array, returns an array with all string values converted to lower case.
     *
     * @param source The source value to make lower case.
     * @returns The lower case value.
     */
    function lowerCaseAllStrings(source) {
        if (source) {
            var type = typeof source;
            if (type === "string") {
                return toLowerCaseOnlyWithValue(source);
            }
            else if (Array.isArray(source)) {
                return source.map(function (arrayValue) { return lowerCaseAllStrings(arrayValue); });
            }
            else if (type === "object") {
                var sourceAsStringMap_1 = source;
                MsftSme.forEachKey(sourceAsStringMap_1, function (key) {
                    sourceAsStringMap_1[key] = lowerCaseAllStrings(sourceAsStringMap_1[key]);
                });
                return sourceAsStringMap_1;
            }
        }
        return source;
    }
    MsftSme.lowerCaseAllStrings = lowerCaseAllStrings;
    var sideLoadKey = 'MsftSme.SideLoad@';
    /**
     * Read all side-loading settings on current loaded domain.
     */
    function sideLoadRead() {
        // Read sideload data from localstorage
        var global = window;
        var length = global.localStorage.length;
        var keys = [];
        for (var index = 0; index < length; index++) {
            var key_1 = global.localStorage.key(index);
            if (key_1.startsWith(sideLoadKey)) {
                keys.push(key_1);
            }
        }
        var data = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var item = JSON.parse(global.localStorage.getItem(key));
            data[item.origin] = item;
        }
        // Read sideload data from 'sideload' url parameter
        var query = decodeURIComponent(window.location.search.substring(1));
        var sideloadParam = query
            .split('&')
            .map(function (p) {
            var kvp = p.split('=');
            return { key: kvp[0], value: kvp[1] };
        })
            .find(function (p) { return p.key && p.key.toLowerCase() === 'sideload'; });
        // if we found the parameter and it has a value, then process the sideload data
        if (sideloadParam && sideloadParam.value) {
            // sideload parameter should be a comma seperated list
            sideloadParam.value.split(',')
                .forEach(function (s) { data[s] = { origin: s }; });
        }
        return data;
    }
    function sideLoad(originUri) {
        if (arguments.length > 1) {
            throw new Error("Incorrect syntax for side loading. Please use 'MsftSme.sideload(<origin>);' where '<originUri>' is similar to 'http://localhost:4201'. The new syntax will load any module from the manifest at <originUri>/manifest.json at runtime.");
        }
        if (originUri) {
            if (!['http://', 'https://'].some(function (prefix) { return originUri.startsWith(prefix); })) {
                throw new Error("Incorrect syntax for side loading. To ensure cross origin sideloads support, please begin your sideload origin with \"http://\" or \"https://\". Ex. \"MsftSme.sideload('http://" + originUri + "')\"");
            }
            var item = {
                origin: originUri
            };
            global.localStorage.setItem(sideLoadKey + originUri, JSON.stringify(item));
            var data = {};
            data[originUri] = item;
            return data;
        }
        return sideLoadRead();
    }
    MsftSme.sideLoad = sideLoad;
    /**
     * Reset all side-loading settings on current loaded domain.
     */
    function sideLoadReset() {
        var global = window;
        var length = global.localStorage.length;
        var keys = [];
        for (var index = 0; index < length; index++) {
            var key = global.localStorage.key(index);
            if (key.startsWith(sideLoadKey)) {
                keys.push(key);
            }
        }
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            global.localStorage.removeItem(key);
        }
    }
    MsftSme.sideLoadReset = sideLoadReset;
    var consoleDebugKey = 'MsftSme.ConsoleDebug';
    /**
     * Read debug console setting.
     */
    function consoleDebugRead() {
        // first check for a query parameter that tells us what debug level to use
        var query = decodeURIComponent(window.location.search.substring(1));
        var consoleDebugParam = query
            .split('&')
            .map(function (p) {
            var kvp = p.split('=');
            return { key: kvp[0], value: kvp[1] };
        })
            .find(function (p) { return p.key && p.key.toLowerCase() === 'consoledebug'; });
        // if we found the parameter and it has a value, then process that as our sideload setting data
        if (consoleDebugParam && consoleDebugParam.value) {
            try {
                var level = parseInt(consoleDebugParam.value);
                return level;
            }
            catch (ex) {
                console.error("Error reading \"consoleDebug\" parameter: " + ex.message);
            }
        }
        // then we fallback to what is saved in localStorage
        var data = JSON.parse(global.localStorage.getItem(consoleDebugKey));
        if (data && data.level) {
            return data.level;
        }
        // fallback again to whatever was passed into the Init call
        var smeWindow = global;
        if (smeWindow && smeWindow.MsftSme && smeWindow.MsftSme.Init) {
            return smeWindow.MsftSme.Init.logLevel;
        }
        // return null if not set yet. using default see at core-enviromnent.
        return null;
    }
    function consoleDebug(level) {
        if (level) {
            console.log('1:Critical, 2:Error, 3:Warning, 4:Success, 5:Informational, 6:Verbose, 7:Debug');
            global.localStorage.setItem(consoleDebugKey, JSON.stringify({ level: level }));
            global.MsftSme.Init.logLevel = level;
            return level;
        }
        return consoleDebugRead();
    }
    MsftSme.consoleDebug = consoleDebug;
    /**
     * Reset all side-loading settings on current loaded domain.
     */
    function consoleDebugReset() {
        global.localStorage.removeItem(consoleDebugKey);
    }
    MsftSme.consoleDebugReset = consoleDebugReset;
    /**
     * Gets the localized strings initialized by localization manager. The LocalizationManager should have
     * been used to get the localized strings. This can also be achieved by calling SmeEnvironment.initEnvironment().
     * @returns an object containing all the localized strings, or null if noe localized strings have been fetched yet
     */
    function resourcesStrings() {
        if (!global.MsftSme.Resources || !global.MsftSme.Resources.strings) {
            throw new Error('Unable to access localized ResourcesStrings data.');
        }
        return global.MsftSme.Resources.strings;
    }
    MsftSme.resourcesStrings = resourcesStrings;
    /**
     * Gets current session identification.
     * Within the same browser session, the session ID is the same on shell and all modules.
     */
    function sessionId() {
        var global = window;
        return global.MsftSme.Init.sessionId;
    }
    MsftSme.sessionId = sessionId;
    /**
     * Gets the self object of global MsftSme.
     */
    function self() {
        return window.MsftSme;
    }
    MsftSme.self = self;
    /** array.ts */
    polyfill(Array, {
        concatUnique: function (other, predicate) {
            return union(this, other, predicate);
        },
        first: function (predicate, startIndex) {
            // Intentionally not using _.find here, since here if we don't find the element
            // we return null. In _.find when this happens we return undefined.
            var index = findIndex(this, predicate, startIndex);
            return index < 0 ? null : this[index];
        },
        firstIndex: function (predicate, startIndex) {
            return findIndex(this, predicate, startIndex);
        },
        last: function () {
            if (this.length < 1) {
                throw new Error("Cannot get the last element because the array is empty.");
            }
            return this[this.length - 1];
        },
        mapMany: function (selector) {
            return mapMany(this, selector);
        },
        remove: function (item) {
            return remove(this, function (current) { return current === item; });
        },
        stableSort: function (compare) {
            return stableSort(this, compare);
        },
        // Deprecated. Remove on or after 2016/02/01.
        toNumberMap: function (keySelector) {
            var ret = [];
            this.forEach(function (value) {
                ret[keySelector(value)] = value;
            });
            return ret;
        },
        unique: function (predicate) {
            return unique(this, predicate);
        }
    });
    /** string.ts */
    var namedFormatSpecifierRegex = /\{[a-zA-Z$_\d]*\}/g;
    var numberedFormatSpecifierRegex = /\{(\d+)\}/g;
    function format() {
        var restArgs = arguments, value = this;
        var matched = false, retVal;
        var isFormatObject = restArgs.length === 1 && restArgs[0] && typeof restArgs[0] === "object";
        var isFormatObjectWithTokenFormatter = restArgs.length === 2 && restArgs[0] && typeof restArgs[0] === "object" && (typeof restArgs[1] === "function" || restArgs[1] === null);
        var tokenFormatter = isFormatObjectWithTokenFormatter ? restArgs[1] : null;
        if (isFormatObject || isFormatObjectWithTokenFormatter) {
            var actualArg = restArgs[0];
            retVal = value.replace(namedFormatSpecifierRegex, function (match) {
                var name = match.substring(1, match.length - 1);
                if (actualArg.hasOwnProperty(name)) {
                    matched = true;
                    var tokenValue = actualArg[name];
                    return tokenFormatter ? tokenFormatter(tokenValue) : tokenValue;
                }
                else {
                    return match;
                }
            });
        }
        // we get here in two cases:
        //    1. we don't have a format object
        //    2. we do have a format object but it's properties didn't match any of the named parameters.
        //       this often happens when developers write code like:
        //          try {
        //              ...
        //          } catch(err) {
        //              log("abc: {0}".format(err));
        //          }
        //       in this scenario also we want to match by number.
        //
        if (!matched) {
            retVal = value.replace(numberedFormatSpecifierRegex, function (match, num) {
                if (num < restArgs.length) {
                    var tokenValue = restArgs[num];
                    return tokenFormatter ? tokenFormatter(tokenValue) : tokenValue;
                }
                else {
                    return match;
                }
            });
        }
        return retVal;
    }
    polyfill(String, {
        format: format,
        localeCompareIgnoreCase: function (value, locales, options) {
            return localeCompareIgnoreCase(this, value, locales, options);
        },
        replaceAll: function (searchValue, replaceValue) {
            return replaceAll(this, searchValue, replaceValue);
        },
        replaceMany: function (replacementMap) {
            return replaceMany(this, replacementMap);
        },
        repeat: function (count) {
            return repeat(this, count);
        },
        startsWith: function (searchString, position) {
            return startsWith(this, searchString, position);
        },
        endsWith: function (searchString, position) {
            return endsWith(this, searchString, position);
        },
    }, /* force */ true);
    global.MsftSme = MsftSme;
})(MsftSme || (MsftSme = {}));
/* tslint:enable */
//# sourceMappingURL=data:application/json;base64,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TUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUNELE1BQU0sRUFBRSxVQUFVLEtBQUs7WUFDbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUNELFVBQVUsRUFBRSxVQUFVLFlBQVksRUFBRSxRQUFRO1lBQ3hDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsUUFBUSxFQUFFLFVBQVUsWUFBWSxFQUFFLFFBQVE7WUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FDSixFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVyQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUM3QixDQUFDLEVBLzlEUyxPQUFPLEtBQVAsT0FBTyxRQSs5RGhCO0FBQ0QsbUJBQW1CIiwiZmlsZSI6InV0aWxpdGllcy5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=