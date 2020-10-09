'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Vue = require('vue');

var vueDraggableCore = require('vue-draggable-core');

var vueResizableCore = require('vue-resizable-core');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function require(path, base) {
      return commonjsRequire(path, base === undefined || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}

function commonjsRequire() {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var lodash_isequal = createCommonjsModule(function (module, exports) {
  /**
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright JS Foundation and other contributors <https://js.foundation/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;
  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /** Used to compose bitmasks for value comparisons. */

  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;
  /** Used as references for various `Number` constants. */

  var MAX_SAFE_INTEGER = 9007199254740991;
  /** `Object#toString` result references. */

  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /** Used to identify `toStringTag` values of typed arrays. */

  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /** Detect free variable `exports`. */

  var freeExports = exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Detect free variable `process` from Node.js. */

  var freeProcess = moduleExports && freeGlobal.process;
  /** Used to access faster Node.js helpers. */

  var nodeUtil = function () {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();
  /* Node.js helper references. */


  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */

  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];

      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }

    return result;
  }
  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */


  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }

    return array;
  }
  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */


  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }

    return false;
  }
  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */


  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }

    return result;
  }
  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */


  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }
  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function cacheHas(cache, key) {
    return cache.has(key);
  }
  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */


  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }
  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */


  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);
    map.forEach(function (value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */


  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }
  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */


  function setToArray(set) {
    var index = -1,
        result = Array(set.size);
    set.forEach(function (value) {
      result[++index] = value;
    });
    return result;
  }
  /** Used for built-in method references. */


  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to detect overreaching core-js shims. */

  var coreJsData = root['__core-js_shared__'];
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */


  var nativeObjectToString = objectProto.toString;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /** Built-in value references. */

  var Buffer = moduleExports ? root.Buffer : undefined,
      _Symbol = root.Symbol,
      Uint8Array = root.Uint8Array,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice,
      symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object);
  /* Built-in method references that are verified to be native. */

  var DataView = getNative(root, 'DataView'),
      Map = getNative(root, 'Map'),
      Promise = getNative(root, 'Promise'),
      Set = getNative(root, 'Set'),
      WeakMap = getNative(root, 'WeakMap'),
      nativeCreate = getNative(Object, 'create');
  /** Used to detect maps, sets, and weakmaps. */

  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */


  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function hashGet(key) {
    var data = this.__data__;

    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */


  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  } // Add methods to `Hash`.


  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */


  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    --this.size;
    return true;
  }
  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }
  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */


  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */


  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map || ListCache)(),
      'string': new Hash()
    };
  }
  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */


  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */

  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();

    while (++index < length) {
      this.add(values[index]);
    }
  }
  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */


  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);

    return this;
  }
  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */


  function setCacheHas(value) {
    return this.__data__.has(value);
  } // Add methods to `SetCache`.


  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */


  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);
    this.size = data.size;
    return result;
  }
  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function stackGet(key) {
    return this.__data__.get(key);
  }
  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function stackHas(key) {
    return this.__data__.has(key);
  }
  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */


  function stackSet(key, value) {
    var data = this.__data__;

    if (data instanceof ListCache) {
      var pairs = data.__data__;

      if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }

      data = this.__data__ = new MapCache(pairs);
    }

    data.set(key, value);
    this.size = data.size;
    return this;
  } // Add methods to `Stack`.


  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }

    return result;
  }
  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */


  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */


  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */


  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }

    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }

    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */


  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag : getTag(object),
        othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }

      objIsArr = true;
      objIsObj = false;
    }

    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }

    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }

    if (!isSameTag) {
      return false;
    }

    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */


  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */


  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */


  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }
  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */


  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    } // Assume cyclic values are equal.


    var stacked = stack.get(array);

    if (stacked && stack.get(other)) {
      return stacked == other;
    }

    var index = -1,
        result = true,
        seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;
    stack.set(array, other);
    stack.set(other, array); // Ignore non-index properties.

    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }

      if (compared !== undefined) {
        if (compared) {
          continue;
        }

        result = false;
        break;
      } // Recursively compare arrays (susceptible to call stack limits).


      if (seen) {
        if (!arraySome(other, function (othValue, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }

    stack['delete'](array);
    stack['delete'](other);
    return result;
  }
  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */


  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }

        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }

        return true;

      case boolTag:
      case dateTag:
      case numberTag:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq(+object, +other);

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == other + '';

      case mapTag:
        var convert = mapToArray;

      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        } // Assume cyclic values are equal.


        var stacked = stack.get(object);

        if (stacked) {
          return stacked == other;
        }

        bitmask |= COMPARE_UNORDERED_FLAG; // Recursively compare objects (susceptible to call stack limits).

        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;

      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }

    }

    return false;
  }
  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */


  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        objProps = getAllKeys(object),
        objLength = objProps.length,
        othProps = getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }

    var index = objLength;

    while (index--) {
      var key = objProps[index];

      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    } // Assume cyclic values are equal.


    var stacked = stack.get(object);

    if (stacked && stack.get(other)) {
      return stacked == other;
    }

    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;

    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      } // Recursively compare objects (susceptible to call stack limits).


      if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }

      skipCtor || (skipCtor = key == 'constructor');
    }

    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor; // Non `Object` object instances with different constructors are not equal.

      if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }

    stack['delete'](object);
    stack['delete'](other);
    return result;
  }
  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */


  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }
  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */


  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */


  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);

    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }

    return result;
  }
  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */


  var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
    if (object == null) {
      return [];
    }

    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function (symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function getTag(value) {
      var result = baseGetTag(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;

          case mapCtorString:
            return mapTag;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag;

          case weakMapCtorString:
            return weakMapTag;
        }
      }

      return result;
    };
  }
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */


  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }
  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */


  function isKeyable(value) {
    var type = _typeof(value);

    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */


  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */


  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
  }
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */


  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */


  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }
  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */


  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */


  var isArguments = baseIsArguments(function () {
    return arguments;
  }()) ? baseIsArguments : function (value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  };
  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */

  var isArray = Array.isArray;
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */

  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */


  var isBuffer = nativeIsBuffer || stubFalse;
  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent.
   *
   * **Note:** This method supports comparing arrays, array buffers, booleans,
   * date objects, error objects, maps, numbers, `Object` objects, regexes,
   * sets, strings, symbols, and typed arrays. `Object` objects are compared
   * by their own, not inherited, enumerable properties. Functions and DOM
   * nodes are compared by strict equality, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.isEqual(object, other);
   * // => true
   *
   * object === other;
   * // => false
   */

  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */


  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    } // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.


    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */


  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */


  function isObject(value) {
    var type = _typeof(value);

    return value != null && (type == 'object' || type == 'function');
  }
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */


  function isObjectLike(value) {
    return value != null && _typeof(value) == 'object';
  }
  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */


  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */

  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */


  function stubArray() {
    return [];
  }
  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */


  function stubFalse() {
    return false;
  }

  module.exports = isEqual;
});
var CompactType;

(function (CompactType) {
  CompactType["horizontal"] = "horizontal";
  CompactType["vertical"] = "vertical";
})(CompactType || (CompactType = {}));

var isProduction = process.env.NODE_ENV === 'production';
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */

function bottom(layout) {
  var max = 0,
      bottomY;

  for (var i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i].y + layout[i].h;
    if (bottomY > max) max = bottomY;
  }

  return max;
}

function cloneLayout(layout) {
  var newLayout = Array(layout.length);

  for (var i = 0, len = layout.length; i < len; i++) {
    newLayout[i] = cloneLayoutItem(layout[i]);
  }

  return newLayout;
} // Fast path to cloning, since this is monomorphic


function cloneLayoutItem(layoutItem) {
  return {
    w: layoutItem.w,
    h: layoutItem.h,
    x: layoutItem.x,
    y: layoutItem.y,
    i: layoutItem.i,
    minW: layoutItem.minW,
    maxW: layoutItem.maxW,
    minH: layoutItem.minH,
    maxH: layoutItem.maxH,
    moved: Boolean(layoutItem.moved),
    "static": Boolean(layoutItem["static"]),
    // These can be null/undefined
    isDraggable: layoutItem.isDraggable,
    isResizable: layoutItem.isResizable,
    resizeHandles: layoutItem.resizeHandles,
    isBounded: layoutItem.isBounded
  };
}
/**
 * Given two layoutitems, check if they collide.
 */


function collides(l1, l2) {
  if (l1.i === l2.i) return false; // same element

  if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2

  if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2

  if (l1.y + l1.h <= l2.y) return false; // l1 is above l2

  if (l1.y >= l2.y + l2.h) return false; // l1 is below l2

  return true; // boxes overlap
}
/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * Does not modify layout items (clones). Creates a new layout array.
 *
 * @param  {Array} layout Layout.
 * @param compactType
 * @param cols
 *   vertically.
 * @return {Array}       Compacted Layout.
 */


function compact(layout, compactType, cols) {
  // Statics go in the compareWith array right away so items flow around them.
  var compareWith = getStatics(layout); // We go through the items by row and column.

  var sorted = sortLayoutItems(layout, compactType); // Holding for new items.

  var out = Array(layout.length);

  for (var i = 0, len = sorted.length; i < len; i++) {
    var l = cloneLayoutItem(sorted[i]); // Don't move static elements

    if (!l["static"]) {
      l = compactItem(compareWith, l, compactType, cols, sorted); // Add to comparison array. We only collide with items before this one.
      // Statics are already in this array.

      compareWith.push(l);
    } // Add to output array to make sure they still come out in the right order.


    out[layout.indexOf(sorted[i])] = l; // Clear moved flag, if it exists.

    l.moved = false;
  }

  return out;
}

var heightWidth = {
  x: 'w',
  y: 'h'
};
/**
 * Before moving item down, it will check if the movement will cause collisions and move those items down before.
 */

function resolveCompactionCollision(layout, item, moveToCoord, axis) {
  var sizeProp = heightWidth[axis];
  item[axis] += 1;
  var itemIndex = layout.map(function (layoutItem) {
    return layoutItem.i;
  }).indexOf(item.i); // Go through each item we collide with.

  for (var i = itemIndex + 1; i < layout.length; i++) {
    var otherItem = layout[i]; // Ignore static items

    if (otherItem["static"]) continue; // Optimization: we can break early if we know we're past this el
    // We can do this b/c it's a sorted layout

    if (otherItem.y > item.y + item.h) break;

    if (collides(item, otherItem)) {
      resolveCompactionCollision(layout, otherItem, moveToCoord + item[sizeProp], axis);
    }
  }

  item[axis] = moveToCoord;
}
/**
 * Compact an item in the layout.
 *
 * Modifies item.
 *
 */


function compactItem(compareWith, l, compactType, cols, fullLayout) {
  var compactV = compactType === 'vertical';
  var compactH = compactType === 'horizontal';

  if (compactV) {
    // Bottom 'y' possible is the bottom of the layout.
    // This allows you to do nice stuff like specify {y: Infinity}
    // This is here because the layout must be sorted in order to get the correct bottom `y`.
    l.y = Math.min(bottom(compareWith), l.y); // Move the element up as far as it can go without colliding.

    while (l.y > 0 && !getFirstCollision(compareWith, l)) {
      l.y--;
    }
  } else if (compactH) {
    l.y = Math.min(bottom(compareWith), l.y); // Move the element left as far as it can go without colliding.

    while (l.x > 0 && !getFirstCollision(compareWith, l)) {
      l.x--;
    }
  } // Move it down, and keep moving it down if it's colliding.


  var collides;

  while (collides = getFirstCollision(compareWith, l)) {
    if (compactH) {
      resolveCompactionCollision(fullLayout, l, collides.x + collides.w, 'x');
    } else {
      resolveCompactionCollision(fullLayout, l, collides.y + collides.h, 'y');
    } // Since we can't grow without bounds horizontally, if we've overflown, let's move it down and try again.


    if (compactH && l.x + l.w > cols) {
      l.x = cols - l.w;
      l.y++;
    }
  }

  return l;
}
/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * Modifies layout items.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */


function correctBounds(layout, bounds) {
  var collidesWith = getStatics(layout);

  for (var i = 0, len = layout.length; i < len; i++) {
    var l = layout[i]; // Overflows right

    if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w; // Overflows left

    if (l.x < 0) {
      l.x = 0;
      l.w = bounds.cols;
    }

    if (!l["static"]) collidesWith.push(l);else {
      // If this is static and collides with other statics, we must move it down.
      // We have to do something nicer than just letting them overlap.
      while (getFirstCollision(collidesWith, l)) {
        l.y++;
      }
    }
  }

  return layout;
}
/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */


function getLayoutItem(layout, id) {
  for (var i = 0, len = layout.length; i < len; i++) {
    if (layout[i].i === id) return layout[i];
  }
}
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param layout
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */


function getFirstCollision(layout, layoutItem) {
  for (var i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) return layout[i];
  }
}

function getAllCollisions(layout, layoutItem) {
  return layout.filter(function (l) {
    return collides(l, layoutItem);
  });
}
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */


function getStatics(layout) {
  return layout.filter(function (l) {
    return l["static"];
  });
}
/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * Modifies layout items.
 *
 * @param  {Array}      layout            Full layout to modify.
 * @param  {LayoutItem} l                 element to move.
 * @param  {Number}     [x]               X position in grid units.
 * @param  {Number}     [y]               Y position in grid units.
 * @param isUserAction
 * @param preventCollision
 * @param compactType
 * @param cols
 */


function moveElement(layout, l, x, y, isUserAction, preventCollision, compactType, cols) {
  // If this is static and not explicitly enabled as draggable,
  // no move is possible, so we can short-circuit this immediately.
  if (l["static"] && l.isDraggable !== true) return layout; // Short-circuit if nothing to do.

  if (l.y === y && l.x === x) return layout;
  log("Moving element ".concat(l.i, " to [").concat(String(x), ",").concat(String(y), "] from [").concat(l.x, ",").concat(l.y, "]"));
  var oldX = l.x;
  var oldY = l.y; // This is quite a bit faster than extending the object

  if (typeof x === 'number') l.x = x;
  if (typeof y === 'number') l.y = y;
  l.moved = true; // If this collides with anything, move it.
  // When doing this comparison, we have to sort the items we compare with
  // to ensure, in the case of multiple collisions, that we're getting the
  // nearest collision.

  var sorted = sortLayoutItems(layout, compactType);
  var movingUp = compactType === 'vertical' && typeof y === 'number' ? oldY >= y : compactType === 'horizontal' && typeof x === 'number' ? oldX >= x : false;
  if (movingUp) sorted = sorted.reverse();
  var collisions = getAllCollisions(sorted, l); // There was a collision; abort

  if (preventCollision && collisions.length) {
    log("Collision prevented on ".concat(l.i, ", reverting."));
    l.x = oldX;
    l.y = oldY;
    l.moved = false;
    return layout;
  } // Move each item that collides away from this element.


  for (var i = 0, len = collisions.length; i < len; i++) {
    var collision = collisions[i];
    log("Resolving collision between ".concat(l.i, " at [").concat(l.x, ",").concat(l.y, "] and ").concat(collision.i, " at [").concat(collision.x, ",").concat(collision.y, "]")); // Short circuit so we can't infinite loop

    if (collision.moved) continue; // Don't move static items - we have to move *this* element away

    if (collision["static"]) {
      layout = moveElementAwayFromCollision(layout, collision, l, isUserAction, compactType);
    } else {
      layout = moveElementAwayFromCollision(layout, l, collision, isUserAction, compactType);
    }
  }

  return layout;
}
/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 * @param isUserAction
 * @param compactType
 * @param cols
 */


function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction, compactType, cols) {
  var compactH = compactType === 'horizontal'; // Compact vertically if not set to horizontal

  var compactV = compactType !== 'horizontal';
  var preventCollision = collidesWith["static"]; // we're already colliding (not for static items)
  // If there is enough space above the collision to put this element, move it there.
  // We only do this on the main collision as this can get funky in cascades and cause
  // unwanted swapping behavior.

  if (isUserAction) {
    // Reset isUserAction flag because we're not in the main collision anymore.
    isUserAction = false; // Make a mock item so we don't modify the item here, only modify in moveElement.

    var fakeItem = {
      x: compactH ? Math.max(collidesWith.x - itemToMove.w, 0) : itemToMove.x,
      y: compactV ? Math.max(collidesWith.y - itemToMove.h, 0) : itemToMove.y,
      w: itemToMove.w,
      h: itemToMove.h,
      i: '-1'
    }; // No collision? If so, we can go up there; otherwise, we'll end up moving down as normal

    if (!getFirstCollision(layout, fakeItem)) {
      log("Doing reverse collision on ".concat(itemToMove.i, " up to [").concat(fakeItem.x, ",").concat(fakeItem.y, "]."));
      return moveElement(layout, itemToMove, compactH ? fakeItem.x : undefined, compactV ? fakeItem.y : undefined, isUserAction, preventCollision, compactType);
    }
  }

  return moveElement(layout, itemToMove, compactH ? itemToMove.x + 1 : undefined, compactV ? itemToMove.y + 1 : undefined, isUserAction, preventCollision, compactType);
}
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */


function perc(num) {
  return num * 100 + '%';
}

function setTransform(_ref) {
  var top = _ref.top,
      left = _ref.left,
      width = _ref.width,
      height = _ref.height;
  // Replace unitless items with px
  var translate = "translate(".concat(left, "px,").concat(top, "px)");
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: "".concat(width, "px"),
    height: "".concat(height, "px"),
    position: 'absolute'
  };
}

function setTopLeft(_ref2) {
  var top = _ref2.top,
      left = _ref2.left,
      width = _ref2.width,
      height = _ref2.height;
  return {
    top: "".concat(top, "px"),
    left: "".concat(left, "px"),
    width: "".concat(width, "px"),
    height: "".concat(height, "px"),
    position: 'absolute'
  };
}
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */


function sortLayoutItems(layout, compactType) {
  if (compactType === 'horizontal') return sortLayoutItemsByColRow(layout);else return sortLayoutItemsByRowCol(layout);
}
/**
 * Sort layout items by row ascending and column ascending.
 *
 * Does not modify Layout.
 */


function sortLayoutItemsByRowCol(layout) {
  // Slice to clone array as sort modifies
  return layout.slice(0).sort(function (a, b) {
    if (a.y > b.y || a.y === b.y && a.x > b.x) {
      return 1;
    } else if (a.y === b.y && a.x === b.x) {
      // Without this, we can get different sort results in IE vs. Chrome/FF
      return 0;
    }

    return -1;
  });
}
/**
 * Sort layout items by column ascending then row ascending.
 *
 * Does not modify Layout.
 */


function sortLayoutItemsByColRow(layout) {
  return layout.slice(0).sort(function (a, b) {
    if (a.x > b.x || a.x === b.x && a.y > b.y) {
      return 1;
    }

    return -1;
  });
}
/**
 * Generate a layout using the initialLayout and children as a template.
 * Missing entries will be added, extraneous ones will be truncated.
 *
 * Does not modify initialLayout.
 *
 * @param  {Array}  initialLayout Layout passed in through props.
 * @param {Array} children
 * @param cols
 * @param compactType
 * @return {Array}                Working layout.
 */


function synchronizeLayoutWithChildren(initialLayout, children, cols, compactType) {
  initialLayout = initialLayout || []; // Generate one layout item per child.

  var layout = [];
  children.forEach(function (child, i) {
    if (child.$props.i === 'placeholder') {
      return;
    } // Don't overwrite if it already exists.


    var exists = getLayoutItem(initialLayout, String(child.$props.i));

    if (exists) {
      layout[i] = cloneLayoutItem(exists);
    } else {
      var g = child.$attrs['data-grid']; // Hey, this item has a data-grid property, use it.

      if (g) {
        if (!isProduction) {
          // @ts-ignore
          validateLayout([g], 'VueGridLayout.$children');
        } // @ts-ignore


        layout[i] = cloneLayoutItem(_objectSpread(_objectSpread({}, g), {}, {
          i: child.$props.i
        }));
      } else {
        // Nothing provided: ensure this is added to the bottom
        layout[i] = cloneLayoutItem({
          w: 1,
          h: 1,
          x: 0,
          y: bottom(layout),
          i: String(child.$props.i)
        });
      }
    }
  }); // Correct the layout.

  var correctedLayout = correctBounds(layout, {
    cols: cols
  });
  return compact(correctedLayout, compactType, cols);
}
/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */


function validateLayout(layout) {
  var contextName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Layout';
  var subProps = ['x', 'y', 'w', 'h'];
  if (!Array.isArray(layout)) throw new Error(contextName + ' must be an array!');

  for (var i = 0, len = layout.length; i < len; i++) {
    var item = layout[i];

    for (var j = 0; j < subProps.length; j++) {
      if (typeof item[subProps[j]] !== 'number') {
        throw new Error('VueGridLayout: ' + contextName + '[' + i + '].' + subProps[j] + ' must be a number!');
      }
    }

    if (item.i && typeof item.i !== 'string') {
      throw new Error('VueGridLayout: ' + contextName + '[' + i + '].i must be a string!');
    }

    if (item["static"] !== undefined && typeof item["static"] !== 'boolean') {
      throw new Error('VueGridLayout: ' + contextName + '[' + i + '].static must be a boolean!');
    }
  }
}

function log() {}

var noop = function noop() {}; // Helper for generating column width


function calcGridColWidth(positionParams) {
  return (positionParams.containerWidth - positionParams.margin[0] * (positionParams.cols - 1) - positionParams.containerPadding[0] * 2) / positionParams.cols;
} // This can either be called:
// calcGridItemWHPx(w, colWidth, margin[0])
// or
// calcGridItemWHPx(h, rowHeight, margin[1])


function calcGridItemWHPx(gridUnits, colOrRowSize, marginPx) {
  // 0 * Infinity === NaN, which causes problems with resize contraints
  if (!Number.isFinite(gridUnits)) return gridUnits;
  return Math.round(colOrRowSize * gridUnits + Math.max(0, gridUnits - 1) * marginPx);
}
/**
 * Return position on the page given an x, y, w, h.
 * left, top, width, height are all in pixels.
 * @param  {PositionParams} positionParams  Parameters of grid needed for coordinates calculations.
 * @param  {Number}  x                      X coordinate in grid units.
 * @param  {Number}  y                      Y coordinate in grid units.
 * @param  {Number}  w                      W coordinate in grid units.
 * @param  {Number}  h                      H coordinate in grid units.
 * @param state
 * @return {Position}                       Object containing coords.
 */


function calcGridItemPosition(positionParams, x, y, w, h, state) {
  var margin = positionParams.margin,
      containerPadding = positionParams.containerPadding,
      rowHeight = positionParams.rowHeight;
  var colWidth = calcGridColWidth(positionParams);
  var out = {}; // If resizing, use the exact width and height as returned from resizing callbacks.

  if (state && state.resizing) {
    out.width = Math.round(state.resizing.width);
    out.height = Math.round(state.resizing.height);
  } // Otherwise, calculate from grid units.
  else {
      out.width = calcGridItemWHPx(w, colWidth, margin[0]);
      out.height = calcGridItemWHPx(h, rowHeight, margin[1]);
    } // If dragging, use the exact width and height as returned from dragging callbacks.


  if (state && state.dragging) {
    out.top = Math.round(state.dragging.top);
    out.left = Math.round(state.dragging.left);
  } // Otherwise, calculate from grid units.
  else {
      out.top = Math.round((rowHeight + margin[1]) * y + containerPadding[1]);
      out.left = Math.round((colWidth + margin[0]) * x + containerPadding[0]);
    }

  return out;
}
/**
 * Translate x and y coordinates from pixels to grid units.
 * @param  {PositionParams} positionParams  Parameters of grid needed for coordinates calculations.
 * @param  {Number} top                     Top position (relative to parent) in pixels.
 * @param  {Number} left                    Left position (relative to parent) in pixels.
 * @param  {Number} w                       W coordinate in grid units.
 * @param  {Number} h                       H coordinate in grid units.
 * @return {Object}                         x and y in grid units.
 */


function calcXY(positionParams, top, left, w, h) {
  var colWidth = calcGridColWidth(positionParams); // left = colWidth * x + margin * (x + 1)
  // l = cx + m(x+1)
  // l = cx + mx + m
  // l - m = cx + mx
  // l - m = x(c + m)
  // (l - m) / (c + m) = x
  // x = (left - margin) / (coldWidth + margin)

  var x = Math.round((left - positionParams.margin[0]) / (colWidth + positionParams.margin[0]));
  var y = Math.round((top - positionParams.margin[1]) / (positionParams.rowHeight + positionParams.margin[1])); // Capping

  x = clamp(x, 0, positionParams.cols - w);
  y = clamp(y, 0, positionParams.maxRows - h);
  return {
    x: x,
    y: y
  };
}
/**
 * Given a height and width in pixel values, calculate grid units.
 * @param  {PositionParams} positionParams  Parameters of grid needed for coordinates calcluations.
 * @param  {Number} height                  Height in pixels.
 * @param  {Number} width                   Width in pixels.
 * @param  {Number} x                       X coordinate in grid units.
 * @param  {Number} y                       Y coordinate in grid units.
 * @return {Object}                         w, h as grid units.
 */


function calcWH(positionParams, width, height, x, y) {
  var margin = positionParams.margin,
      maxRows = positionParams.maxRows,
      cols = positionParams.cols,
      rowHeight = positionParams.rowHeight;
  var colWidth = calcGridColWidth(positionParams); // width = colWidth * w - (margin * (w - 1))
  // ...
  // w = (width + margin) / (colWidth + margin)

  var w = Math.round((width + margin[0]) / (colWidth + margin[0]));
  var h = Math.round((height + margin[1]) / (rowHeight + margin[1])); // Capping

  w = clamp(w, 0, cols - x);
  h = clamp(h, 0, maxRows - y);
  return {
    w: w,
    h: h
  };
} // Similar to _.clamp


function clamp(num, lowerBound, upperBound) {
  return Math.max(Math.min(num, upperBound), lowerBound);
}
/**
 * An individual item within a VueGridLayout.
 */


var script = Vue__default['default'].extend({
  name: 'VueGridItem',
  components: {
    VueDraggableCore: vueDraggableCore.VueDraggableCore,
    VueResizableCore: vueResizableCore.VueResizableCore
  },
  props: {
    cancel: {
      type: String,
      "default": ''
    },
    handle: {
      type: String,
      "default": ''
    },
    i: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    w: {
      type: Number,
      required: true
    },
    h: {
      type: Number,
      required: true
    },
    minW: {
      type: Number,
      "default": 1
    },
    maxW: {
      type: Number,
      "default": Infinity
    },
    minH: {
      type: Number,
      validator: function validator(value) {
        return value >= 1;
      },
      "default": 1
    },
    maxH: {
      type: Number,
      "default": Infinity
    },
    resizeHandles: {
      type: Array,
      "default": function _default() {
        return ['sw'];
      }
    },
    cols: {
      type: Number,
      required: true
    },
    containerWidth: {
      type: Number,
      required: true
    },
    margin: {
      type: [Array, Object],
      required: true
    },
    containerPadding: {
      type: [Array, Object],
      required: true
    },
    rowHeight: {
      type: Number,
      required: true
    },
    maxRows: {
      type: Number,
      required: true
    },
    isDraggable: {
      type: Boolean
    },
    isResizable: {
      type: Boolean
    },
    isBounded: {
      type: Boolean
    },
    "static": {
      type: Boolean,
      "default": false
    },
    useCSSTransforms: {
      type: Boolean,
      "default": true
    },
    usePercentages: {
      type: Boolean,
      "default": false
    },
    transformScale: {
      type: Number,
      "default": 1
    },
    droppingPosition: {
      type: Object,
      "default": null
    },
    draggableProps: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    resizableProps: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    tag: {
      type: [Object, Function, String],
      "default": 'div'
    },
    offsetParent: {
      type: Object,
      validator: function validator(value) {
        return value && value.nodeType == 1;
      },
      "default": null
    }
  },
  data: function data() {
    return {
      resizing: null,
      dragging: null,
      currentNode: null
    };
  },
  computed: {
    classes: function classes() {
      return {
        'vue-grid-item': true,
        "static": this["static"],
        resizing: Boolean(this.resizing),
        'vue-draggable': this.isDraggable,
        'vue-draggable-dragging': Boolean(this.dragging),
        dropping: Boolean(this.droppingPosition),
        cssTransforms: this.useCSSTransforms
      };
    },
    styles: function styles() {
      return this.createStyle(this.pos());
    },
    newPos: function newPos() {
      return this.pos();
    },
    getPositionParams: function getPositionParams() {
      return {
        cols: this.cols,
        containerPadding: this.containerPadding,
        containerWidth: this.containerWidth,
        margin: this.margin,
        maxRows: this.maxRows,
        rowHeight: this.rowHeight
      };
    },
    maxWidth: function maxWidth() {
      return this.isResizable ? calcGridItemPosition(this.getPositionParams, 0, 0, this.cols - this.x, 0).width : null;
    },
    minConstraints: function minConstraints() {
      if (this.isResizable) {
        var mins = calcGridItemPosition(this.getPositionParams, 0, 0, this.minW, this.minH);
        return [mins.width, mins.height];
      }

      return null;
    },
    maxConstraints: function maxConstraints() {
      if (this.isResizable) {
        var maxes = calcGridItemPosition(this.getPositionParams, 0, 0, this.maxW, this.maxH);
        return [Math.min(maxes.width, this.maxWidth), Math.min(maxes.height, Infinity)];
      }

      return null;
    },
    posWidth: function posWidth() {
      var pos = this.pos;
      return pos ? pos.width : 0;
    },
    posHeight: function posHeight() {
      var pos = this.pos;
      return pos ? pos.height : 0;
    }
  },
  watch: {
    'droppingPosition.left': function droppingPositionLeft(newVal, oldVal) {
      if (!lodash_isequal(newVal, oldVal)) {
        this.moveDroppingItem(oldVal);
      }
    },
    'droppingPosition.top': function droppingPositionTop(newVal, oldVal) {
      if (!lodash_isequal(newVal, oldVal)) {
        this.moveDroppingItem(oldVal);
      }
    }
  },
  mounted: function mounted() {
    this.moveDroppingItem({});
  },
  methods: {
    pos: function pos() {
      return calcGridItemPosition(this.getPositionParams, this.x, this.y, this.w, this.h, this);
    },
    // // When a droppingPosition is present, this means we should fire a move event, as if we had moved
    // // this element by `x, y` pixels.
    moveDroppingItem: function moveDroppingItem(oldVal) {
      if (!this.droppingPosition) return;
      var prevDroppingPosition = oldVal && oldVal || {
        left: 0,
        top: 0
      };
      var shouldDrag = this.dragging && this.droppingPosition.left !== prevDroppingPosition.left || this.droppingPosition.top !== prevDroppingPosition.top;

      if (!this.dragging) {
        this.$emit('dragStart', {
          node: this.$el,
          deltaX: this.droppingPosition.left,
          deltaY: this.droppingPosition.top
        }, this.droppingPosition.e);
      } else if (shouldDrag) {
        var deltaX = this.droppingPosition.left - this.dragging.left;
        var deltaY = this.droppingPosition.top - this.dragging.top;
        this.$emit('drag', {
          node: this.$el,
          deltaX: deltaX,
          deltaY: deltaY
        }, this.droppingPosition.e);
      }
    },

    /**
     * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
     * well when server rendering, and the only way to do that properly is to use percentage width/left because
     * we don't know exactly what the browser viewport is.
     * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
     * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
     *
     * @param  {Object} pos Position object with width, height, left, top.
     * @return {Object}     Style object.
     */
    createStyle: function createStyle(pos) {
      // const { usePercentages, containerWidth, useCSSTransforms } = this;
      var style; // CSS Transforms support (default)

      if (this.useCSSTransforms) {
        style = setTransform(pos);
      } else {
        // top,left (slow)
        style = setTopLeft(pos); // This is used for server rendering.

        if (this.usePercentages) {
          style.left = perc(pos.left / this.containerWidth);
          style.width = perc(pos.width / this.containerWidth);
        }
      }

      return style;
    },

    /**
     * onDragStart event handler
     * @param  {Object} callbackData  an object with node, delta and position information
     * @param  {Event}  e             event data
     */
    dragStart: function dragStart(_ref3, e) {
      var node = _ref3.node;
      var newPosition = {
        top: 0,
        left: 0
      }; // TODO: this wont work on nested parents

      var offsetParent = this.offsetParent || node.offsetParent;
      if (!offsetParent) return;
      var parentRect = offsetParent.getBoundingClientRect();
      var clientRect = node.getBoundingClientRect();
      var cLeft = clientRect.left / this.transformScale;
      var pLeft = parentRect.left / this.transformScale;
      var cTop = clientRect.top / this.transformScale;
      var pTop = parentRect.top / this.transformScale;
      newPosition.left = cLeft - pLeft + offsetParent.scrollLeft;
      newPosition.top = cTop - pTop + offsetParent.scrollTop;
      this.dragging = _objectSpread({}, newPosition); // Call callback with this data

      var _calcXY = calcXY(this.getPositionParams, newPosition.top, newPosition.left, this.w, this.h),
          x = _calcXY.x,
          y = _calcXY.y;

      this.$emit('dragStart', this.i, x, y, {
        e: e,
        node: node,
        newPosition: newPosition
      }); // return onDragStart.call(this, i, x, y, { e, node, newPosition });
    },

    /**
     * onDrag event handler
     * @param  {Object} callbackData  an object with node, delta and position information
     * @param  {Event}  e             event data
     */
    drag: function drag(_ref4, e) {
      var node = _ref4.node,
          deltaX = _ref4.deltaX,
          deltaY = _ref4.deltaY;
      deltaX /= this.transformScale;
      deltaY /= this.transformScale;

      if (!this.dragging) {
        throw new Error('onDrag called before onDragStart.');
      }

      var top = this.dragging.top + deltaY;
      var left = this.dragging.left + deltaX;
      var positionParams = this.getPositionParams; // Boundary calculations; keeps items within the grid

      if (this.isBounded) {
        var offsetParent = node.offsetParent;

        if (offsetParent) {
          var margin = this.margin,
              rowHeight = this.rowHeight;
          var bottomBoundary = offsetParent.clientHeight - calcGridItemWHPx(this.h, rowHeight, margin[1]);
          top = clamp(top, 0, bottomBoundary);
          var colWidth = calcGridColWidth(positionParams);
          var rightBoundary = this.containerWidth - calcGridItemWHPx(this.w, colWidth, margin[0]);
          left = clamp(left, 0, rightBoundary);
        }
      }

      var newPosition = {
        top: top,
        left: left
      };
      this.dragging = _objectSpread({}, newPosition); // this.$set(this.dragging, top, newPosition.top);
      // this.$set(this.dragging, left, newPosition.left);
      // Call callback with this data

      var _calcXY2 = calcXY(positionParams, top, left, this.w, this.h),
          x = _calcXY2.x,
          y = _calcXY2.y;

      this.$emit('drag', this.i, x, y, {
        e: e,
        node: node,
        newPosition: newPosition
      }); // return onDrag.call(this, i, x, y, { e, node, newPosition });
    },

    /**
     * onDragStop event handler
     * @param  {Object} callbackData  an object with node, delta and position information
     * @param  {Event}  e             event data
     */
    dragStop: function dragStop(_ref5, e) {
      var node = _ref5.node;

      if (!this.dragging) {
        throw new Error('onDragEnd called before onDragStart.');
      }

      var _this$dragging = this.dragging,
          left = _this$dragging.left,
          top = _this$dragging.top;
      var newPosition = {
        top: top,
        left: left
      };
      this.dragging = null;

      var _calcXY3 = calcXY(this.getPositionParams, top, left, this.w, this.h),
          x = _calcXY3.x,
          y = _calcXY3.y;

      this.$emit('dragStop', this.i, x, y, {
        e: e,
        node: node,
        newPosition: newPosition
      }); // return onDragStop.call(this, i, x, y, { e, node, newPosition });
    },

    /**
     * onResizeStop event handler
     * @param  {Object} callbackData  an object with node and size information
     * @param  {Event}  e             event data
     */
    resizeStop: function resizeStop(callbackData, e) {
      this.onResizeHandler(callbackData, e, 'resizeStop');
    },

    /**
     * onResizeStart event handler
     * @param  {Object} callbackData  an object with node and size information
     * @param  {Event}  e             event data
     */
    resizeStart: function resizeStart(callbackData, e) {
      this.onResizeHandler(callbackData, e, 'resizeStart');
    },

    /**
     * onResize event handler
     * @param  {Object} callbackData  an object with node and size information
     * @param  {Event}  e             event data
     */
    resize: function resize(callbackData, e) {
      this.onResizeHandler(callbackData, e, 'resize');
    },

    /**
     * Wrapper around drag events to provide more useful data.
     * All drag events call the function with the given handler name,
     * with the signature (index, x, y).
     *
     * @param node
     * @param size
     * @param e
     * @param  {String} handlerName Handler name to wrap.
     * @return {Function}           Handler function.
     */
    onResizeHandler: function onResizeHandler(_ref6, e, handlerName) {
      var node = _ref6.node,
          size = _ref6.size;
      // const { cols, x, y, i, maxH, minH } = this;
      var minW = this.minW,
          maxW = this.maxW; // Get new XY

      var _calcWH = calcWH(this.getPositionParams, size.width, size.height, this.x, this.y),
          w = _calcWH.w,
          h = _calcWH.h; // minW should be at least 1


      minW = Math.max(minW, 1); // maxW should be at most (cols - x)

      maxW = Math.min(maxW, this.cols - this.x); // Min/max capping

      w = clamp(w, minW, maxW);
      h = clamp(h, this.minH, this.maxH);
      this.resizing = handlerName === 'resizeStop' ? null : _objectSpread({}, size);
      this.$emit(handlerName, this.i, w, h, {
        e: e,
        node: node,
        size: size
      }); // handler.call(this, i, w, h, { e, node, size });
    }
  }
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function (context) {
      style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}
/* script */


var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('VueDraggableCore', _vm._b({
    attrs: {
      "handle": _vm.handle,
      "cancel": ".vue-resizable-handle" + (_vm.cancel ? ',' + _vm.cancel : ''),
      "disabled": !_vm.isDraggable,
      "offset-parent": _vm.offsetParent
    },
    on: {
      "dragStart": _vm.dragStart,
      "drag": _vm.drag,
      "dragStop": _vm.dragStop
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(draggableCoreProps) {
        return [_c('VueResizableCore', _vm._b({
          "class": _vm.isResizable ? '' : 'vue-resizable-hide',
          attrs: {
            "draggable-props": Object.assign({}, _vm.resizableProps.draggableProps && _vm.resizableProps.draggableProps, {
              disabled: !_vm.isResizable
            }),
            "width": _vm.newPos.width,
            "height": _vm.newPos.height,
            "min-constraints": _vm.minConstraints,
            "max-constraints": _vm.maxConstraints,
            "transform-scale": _vm.transformScale,
            "resize-handles": _vm.resizeHandles,
            "offset-parent": _vm.offsetParent
          },
          on: {
            "resizeStart": _vm.resizeStart,
            "resize": _vm.resize,
            "resizeStop": _vm.resizeStop
          },
          scopedSlots: _vm._u([{
            key: "default",
            fn: function fn(resizableCoreProps) {
              return [_c(_vm.tag, {
                tag: "component",
                "class": _vm.classes,
                style: _vm.styles,
                on: {
                  "mousedown": draggableCoreProps.mouseDown,
                  "mouseup": draggableCoreProps.mouseUp,
                  "touchend": draggableCoreProps.touchEnd
                }
              }, [_vm._t("default"), _vm._v(" "), _vm._l(resizableCoreProps.resizeHandles, function (resizeHandle) {
                return _c(resizeHandle.wrapper, _vm._g(_vm._b({
                  key: resizeHandle.axis,
                  tag: "component"
                }, 'component', resizeHandle.props, false), resizeHandle.on), [_c('span', {
                  "class": resizeHandle["class"]
                })]);
              })], 2)];
            }
          }], null, true)
        }, 'VueResizableCore', _vm.resizableProps, false))];
      }
    }])
  }, 'VueDraggableCore', _vm.draggableProps, false));
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var VueGridLayoutProps = Vue__default['default'].extend({
  props: {
    width: {
      type: Number,
      required: true
    },
    autoSize: {
      type: Boolean,
      "default": true
    },
    cols: {
      type: Number,
      "default": 12
    },
    draggableCancel: {
      type: String,
      "default": ''
    },
    draggableHandle: {
      type: String,
      "default": ''
    },
    compactType: {
      type: String,
      "default": CompactType.vertical
    },
    layout: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    margin: {
      type: [Object, Array],
      "default": function _default() {
        return [10, 10];
      }
    },
    containerPadding: {
      type: [Object, Array, null],
      "default": null
    },
    rowHeight: {
      type: Number,
      "default": 150
    },
    maxRows: {
      type: Number,
      "default": Infinity
    },
    isBounded: {
      type: Boolean,
      "default": false
    },
    isDraggable: {
      type: Boolean,
      "default": true
    },
    isResizable: {
      type: Boolean,
      "default": true
    },
    isDroppable: {
      type: Boolean,
      "default": false
    },
    preventCollision: {
      type: Boolean,
      "default": false
    },
    useCSSTransforms: {
      type: Boolean,
      "default": true
    },
    transformScale: {
      type: Number,
      "default": 1
    },
    droppingItem: {
      type: Object,
      "default": function _default() {
        return {
          i: '__dropping-elem__',
          h: 1,
          w: 1
        };
      }
    },
    resizeHandles: {
      type: Array,
      "default": function _default() {
        return ['se'];
      }
    }
  }
});
var layoutClass = 'vue-grid-layout';
var isFirefox = false; // Try...catch will protect from navigator not existing (e.g. node) or a bad implementation of navigator

try {
  isFirefox = /firefox/i.test(navigator.userAgent);
} catch (e) {
  /* Ignore */
}

var dragEnterCounter = 0;
var script$1 = VueGridLayoutProps.extend({
  name: 'VueGridLayout',
  components: {
    VueGridItem: __vue_component__
  },
  props: {
    layout: {
      type: Array,
      "default": function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      activeDrag: null,
      currentLayout: [],
      mounted: false,
      oldDragItem: null,
      oldLayout: null,
      oldResizeItem: null,
      droppingDOMNode: null,
      noop: noop
    };
  },
  computed: {
    classes: function classes() {
      return layoutClass;
    },
    styles: function styles() {
      return {
        height: this.containerHeight()
      };
    }
  },
  created: function created() {
    this.currentLayout = this.layout;
  },
  mounted: function mounted() {
    this.mounted = true;
    this.currentLayout = synchronizeLayoutWithChildren(this.layout, this.$children, this.cols, this.compactType);
    this.onLayoutMaybeChanged(this.currentLayout, this.layout);
  },
  watch: {
    layout: {
      handler: function handler(newLayout) {
        this.onLayoutMaybeChanged(newLayout, this.currentLayout);
      },
      deep: true
    }
  },
  methods: {
    isItemDraggable: function isItemDraggable(l) {
      return typeof l.isDraggable === 'boolean' ? l.isDraggable : !l["static"] && this.isDraggable;
    },
    isItemResizable: function isItemResizable(l) {
      return typeof l.isResizable === 'boolean' ? l.isResizable : !l["static"] && this.isResizable;
    },
    isItemBounded: function isItemBounded(l) {
      return this.isItemDraggable(l) && this.isBounded && l.isBounded !== false;
    },
    containerHeight: function containerHeight() {
      if (!this.autoSize) return;
      var nbRow = bottom(this.currentLayout);
      var containerPaddingY = this.containerPadding ? this.containerPadding[1] : this.margin[1];
      return nbRow * this.rowHeight + (nbRow - 1) * this.margin[1] + containerPaddingY * 2 + 'px';
    },

    /**
     * When dragging starts
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDragStart: function onDragStart(i, x, y, _ref7) {
      var e = _ref7.e,
          node = _ref7.node;
      var currentLayout = this.currentLayout;
      var l = getLayoutItem(currentLayout, i);
      if (!l) return;
      this.oldDragItem = cloneLayoutItem(l);
      this.oldLayout = this.currentLayout;
      this.$emit('dragStart', currentLayout, l, l, null, e, node);
    },

    /**
     * Each drag movement create a new dragelement and move the element to the dragged location
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDrag: function onDrag(i, x, y, _ref8) {
      var e = _ref8.e,
          node = _ref8.node;
      var oldDragItem = this.oldDragItem,
          cols = this.cols,
          compactType = this.compactType,
          preventCollision = this.preventCollision;
      var currentLayout = this.currentLayout;
      var l = getLayoutItem(currentLayout, i);
      if (!l) return; // Create placeholder (display only)

      var placeholder = {
        w: l.w,
        h: l.h,
        x: l.x,
        y: l.y,
        placeholder: true,
        i: i
      }; // Move the element to the dragged location.

      var isUserAction = true;
      currentLayout = moveElement(currentLayout, l, x, y, isUserAction, preventCollision, compactType);
      this.$emit('drag', currentLayout, oldDragItem, l, placeholder, e, node);
      this.currentLayout = compact(currentLayout, compactType, cols);
      this.activeDrag = placeholder;
    },

    /**
     * When dragging stops, figure out which position the element is closest to and update its x and y.
     * @param  {String} i Index of the child.
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDragStop: function onDragStop(i, x, y, _ref9) {
      var e = _ref9.e,
          node = _ref9.node;
      if (!this.activeDrag) return;
      var oldDragItem = this.oldDragItem,
          cols = this.cols,
          preventCollision = this.preventCollision,
          compactType = this.compactType;
      var currentLayout = this.currentLayout;
      var l = getLayoutItem(currentLayout, i);
      if (!l) return; // Move the element here

      var isUserAction = true;
      currentLayout = moveElement(currentLayout, l, x, y, isUserAction, preventCollision, compactType);
      this.$emit('dragStop', currentLayout, oldDragItem, l, null, e, node); // Set state

      var newLayout = compact(currentLayout, compactType, cols);
      var oldLayout = this.oldLayout;
      this.activeDrag = null;
      this.currentLayout = newLayout;
      this.oldDragItem = null;
      this.oldLayout = null;
      this.onLayoutMaybeChanged(newLayout, oldLayout);
    },
    onLayoutMaybeChanged: function onLayoutMaybeChanged(newLayout, oldLayout) {
      if (!oldLayout) oldLayout = this.currentLayout;

      if (!lodash_isequal(oldLayout, newLayout)) {
        this.currentLayout = newLayout;
        this.$emit('layoutChange', newLayout);
      }
    },
    onResizeStart: function onResizeStart(i, w, h, _ref10) {
      var e = _ref10.e,
          node = _ref10.node;
      var currentLayout = this.currentLayout;
      var l = getLayoutItem(currentLayout, i);
      if (!l) return;
      this.oldResizeItem = cloneLayoutItem(l);
      this.oldLayout = currentLayout;
      this.$emit('resizeStart', currentLayout, l, l, null, e, node);
    },
    onResize: function onResize(i, w, h, _ref11) {
      var e = _ref11.e,
          node = _ref11.node;
      var currentLayout = this.currentLayout,
          oldResizeItem = this.oldResizeItem,
          cols = this.cols,
          preventCollision = this.preventCollision,
          compactType = this.compactType;
      var l = getLayoutItem(currentLayout, i);
      if (!l) return; // Something like quad tree should be used
      // to find collisions faster

      var hasCollisions;

      if (preventCollision) {
        var collisions = getAllCollisions(currentLayout, _objectSpread(_objectSpread({}, l), {}, {
          w: w,
          h: h
        })).filter(function (layoutItem) {
          return layoutItem.i !== l.i;
        });
        hasCollisions = collisions.length > 0; // If we're colliding, we need adjust the placeholder.

        if (hasCollisions) {
          // adjust w && h to maximum allowed space
          var leastX = Infinity,
              leastY = Infinity;
          collisions.forEach(function (layoutItem) {
            if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x);
            if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y);
          });
          if (Number.isFinite(leastX)) l.w = leastX - l.x;
          if (Number.isFinite(leastY)) l.h = leastY - l.y;
        }
      }

      if (!hasCollisions) {
        // Set new width and height.
        l.w = w;
        l.h = h;
      } // Create placeholder element (display only)


      var placeholder = {
        w: l.w,
        h: l.h,
        x: l.x,
        y: l.y,
        "static": true,
        i: i
      };
      this.$emit('resize', currentLayout, oldResizeItem, l, placeholder, e, node); // Re-compact the layout and set the drag placeholder.

      this.currentLayout = compact(currentLayout, compactType, cols);
      this.activeDrag = placeholder;
    },
    onResizeStop: function onResizeStop(i, w, h, _ref12) {
      var e = _ref12.e,
          node = _ref12.node;
      var currentLayout = this.currentLayout,
          oldResizeItem = this.oldResizeItem,
          compactType = this.compactType,
          cols = this.cols;
      var l = getLayoutItem(currentLayout, i);
      this.$emit('resizeStop', currentLayout, oldResizeItem, l, null, e, node); // this.resizeStop(layout, oldResizeItem, l, null, e, node);
      // Set state

      var newLayout = compact(currentLayout, compactType, cols);
      var oldLayout = this.oldLayout;
      this.activeDrag = null;
      this.currentLayout = newLayout; // this.$set(this, 'layout', newLayout);

      this.oldResizeItem = null;
      this.oldLayout = null;
      this.onLayoutMaybeChanged(newLayout, oldLayout);
    },
    // Called while dragging an element. Part of browser native drag/drop API.
    // Native event target might be the layout itself, or an element within the layout.
    onDragOver: function onDragOver(e) {
      // we should ignore events from layout's children in Firefox
      // to avoid unpredictable jumping of a dropping placeholder
      // FIXME remove this hack
      if (isFirefox && e.nativeEvent.target.className.indexOf(layoutClass) === -1) {
        return false;
      }

      var droppingItem = this.droppingItem,
          margin = this.margin,
          cols = this.cols,
          rowHeight = this.rowHeight,
          maxRows = this.maxRows,
          width = this.width,
          containerPadding = this.containerPadding;
      var currentLayout = this.currentLayout; // This is relative to the DOM element that this event fired for.

      var _e$nativeEvent = e.nativeEvent,
          layerX = _e$nativeEvent.layerX,
          layerY = _e$nativeEvent.layerY;
      var droppingPosition = {
        left: layerX,
        top: layerY,
        e: e
      };

      if (!this.droppingDOMNode) {
        var positionParams = {
          cols: cols,
          margin: margin,
          maxRows: maxRows,
          rowHeight: rowHeight,
          containerWidth: width,
          containerPadding: containerPadding || margin
        };
        var calculatedPosition = calcXY(positionParams, layerY, layerX, droppingItem.w, droppingItem.h);
        this.droppingDOMNode = this.$createElement('div', {
          key: droppingItem.i
        });
        this.droppingPosition = droppingPosition;
        this.currentLayout = [].concat(_toConsumableArray(currentLayout), [_objectSpread(_objectSpread({}, droppingItem), {}, {
          x: calculatedPosition.x,
          y: calculatedPosition.y,
          "static": false,
          isDraggable: true
        })]);
      } else if (this.droppingPosition) {
        var _this$droppingPositio = this.droppingPosition,
            left = _this$droppingPositio.left,
            top = _this$droppingPositio.top;
        var shouldUpdatePosition = left != layerX || top != layerY;

        if (shouldUpdatePosition) {
          this.droppingPosition = droppingPosition;
        }
      }

      e.stopPropagation();
      e.preventDefault();
    },
    removeDroppingPlaceholder: function removeDroppingPlaceholder() {
      var droppingItem = this.droppingItem,
          cols = this.cols;
      var currentLayout = this.currentLayout;
      this.currentLayout = compact(currentLayout.filter(function (l) {
        return l.i !== droppingItem.i;
      }), this.compactType, cols);
      this.droppingDOMNode = null;
      this.activeDrag = null;
      this.droppingPosition = undefined;
    },
    onDragLeave: function onDragLeave() {
      dragEnterCounter--; // onDragLeave can be triggered on each layout's child.
      // But we know that count of dragEnter and dragLeave events
      // will be balanced after leaving the layout's container
      // so we can increase and decrease count of dragEnter and
      // when it'll be equal to 0 we'll remove the placeholder

      if (dragEnterCounter === 0) {
        this.removeDroppingPlaceholder();
      }
    },
    onDragEnter: function onDragEnter() {
      dragEnterCounter++;
    },
    onDrop: function onDrop(e) {
      var droppingItem = this.droppingItem;
      var currentLayout = this.currentLayout;
      var item = currentLayout.find(function (l) {
        return l.i === droppingItem.i;
      }); // reset gragEnter counter on drop

      dragEnterCounter = 0;
      this.removeDroppingPlaceholder();
      this.$emit('drop', currentLayout, item, e);
    }
  }
});
/* script */

var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__$1() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    "class": _vm.classes,
    style: _vm.styles,
    on: {
      "drop": function drop($event) {
        _vm.isDroppable ? _vm.onDrop : _vm.noop;
      },
      "dragLeave": function dragLeave($event) {
        _vm.isDroppable ? _vm.onDragLeave : _vm.noop;
      },
      "dragEnter": function dragEnter($event) {
        _vm.isDroppable ? _vm.onDragEnter : _vm.noop;
      },
      "dragOver": function dragOver($event) {
        _vm.isDroppable ? _vm.onDragOver : _vm.noop;
      }
    }
  }, [_vm._l(_vm.currentLayout, function (l) {
    return _c('VueGridItem', {
      key: l.i,
      attrs: {
        "container-width": _vm.width,
        "cols": _vm.cols,
        "margin": _vm.margin,
        "container-padding": _vm.containerPadding || _vm.margin,
        "max-rows": _vm.maxRows,
        "row-height": _vm.rowHeight,
        "cancel": _vm.draggableCancel,
        "handle": _vm.draggableHandle,
        "is-draggable": _vm.isItemDraggable(l),
        "is-resizable": _vm.isItemResizable(l),
        "is-bounded": _vm.isItemBounded(l),
        "use-c-s-s-transforms": _vm.useCSSTransforms && _vm.mounted,
        "use-percentages": !_vm.mounted,
        "transform-scale": _vm.transformScale,
        "w": l.w,
        "h": l.h,
        "x": l.x,
        "y": l.y,
        "i": l.i,
        "min-h": l.minH,
        "min-w": l.minW,
        "max-w": l.maxW,
        "max-h": l.maxH,
        "static": l["static"],
        "dropping-position": _vm.isDroppingItem ? _vm.droppingPosition : undefined,
        "resize-handles": l.resizeHandles || _vm.resizeHandles,
        "offset-parent": _vm.$el
      },
      on: {
        "dragStart": _vm.onDragStart,
        "dragStop": _vm.onDragStop,
        "drag": _vm.onDrag,
        "resizeStart": _vm.onResizeStart,
        "resizeStop": _vm.onResizeStop,
        "resize": _vm.onResize
      }
    }, [_vm._t("item", null, {
      "w": l.w,
      "h": l.h,
      "x": l.x,
      "y": l.y,
      "i": l.i
    })], 2);
  }), _vm._v(" "), _c('VueGridItem', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.activeDrag,
      expression: "activeDrag"
    }],
    staticClass: "vue-grid-placeholder",
    attrs: {
      "cols": _vm.cols,
      "margin": _vm.margin,
      "transform-scale": _vm.transformScale,
      "use-c-s-s-transforms": _vm.useCSSTransforms,
      "is-bounded": false,
      "is-resizable": false,
      "is-draggable": false,
      "row-height": _vm.rowHeight,
      "container-width": _vm.width,
      "container-padding": _vm.containerPadding || _vm.margin,
      "max-rows": _vm.maxRows,
      "w": _vm.activeDrag && _vm.activeDrag.w || 0,
      "h": _vm.activeDrag && _vm.activeDrag.h || 0,
      "x": _vm.activeDrag && _vm.activeDrag.x || 0,
      "y": _vm.activeDrag && _vm.activeDrag.y || 0,
      "i": _vm.activeDrag && _vm.activeDrag.i || 'placeholder'
    }
  }, [_c('div')])], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);
/**
 * Given a width, find the highest breakpoint that matches is valid for it (width > breakpoint).
 *
 * @param  {Object} breakpoints Breakpoints object (e.g. {lg: 1200, md: 960, ...})
 * @param  {Number} width Screen width.
 * @return {String}       Highest breakpoint that is less than width.
 */


function getBreakpointFromWidth(breakpoints, width) {
  var sorted = sortBreakpoints(breakpoints);
  var matching = sorted[0];

  for (var i = 1, len = sorted.length; i < len; i++) {
    var breakpointName = sorted[i];
    if (width > breakpoints[breakpointName]) matching = breakpointName;
  }

  return matching;
}
/**
 * Given a breakpoint, get the # of cols set for it.
 * @param  {String} breakpoint Breakpoint name.
 * @param  {Object} cols       Map of breakpoints to cols.
 * @return {Number}            Number of cols.
 */


function getColsFromBreakpoint(breakpoint, cols) {
  if (!cols[breakpoint]) {
    throw new Error('ResponsiveVueGridLayout: `cols` entry for breakpoint ' + breakpoint + ' is missing!');
  }

  return cols[breakpoint];
}
/**
 * Given existing layouts and a new breakpoint, find or generate a new layout.
 *
 * This finds the layout above the new one and generates from it, if it exists.
 *
 * @param  {Object} layouts     Existing layouts.
 * @param  {Array} breakpoints All breakpoints.
 * @param  {String} breakpoint New breakpoint.
 * @param  {String} lastBreakpoint
 * @param  {String} breakpoint Last breakpoint (for fallback).
 * @param  {Number} cols       Column count at new breakpoint.
 * @param  {CompactType} compactType
 *   vertically.
 * @return {Array}             New layout.
 */


function findOrGenerateResponsiveLayout(layouts, breakpoints, breakpoint, lastBreakpoint, cols, compactType) {
  // If it already exists, just return it.
  if (layouts[breakpoint]) return cloneLayout(layouts[breakpoint]); // Find or generate the next layout

  var layout = layouts[lastBreakpoint];
  var breakpointsSorted = sortBreakpoints(breakpoints);
  var breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint));

  for (var i = 0, len = breakpointsAbove.length; i < len; i++) {
    var b = breakpointsAbove[i];

    if (layouts[b]) {
      layout = layouts[b];
      break;
    }
  }

  layout = cloneLayout(layout || []); // clone layout so we don't modify existing items

  return compact(correctBounds(layout, {
    cols: cols
  }), compactType, cols);
}
/**
 * Given breakpoints, return an array of breakpoints sorted by width. This is usually
 * e.g. ['xxs', 'xs', 'sm', ...]
 *
 * @param  {Object} breakpoints Key/value pair of breakpoint names to widths.
 * @return {Array}              Sorted breakpoints.
 */


function sortBreakpoints(breakpoints) {
  var keys = Object.keys(breakpoints);
  return keys.sort(function (a, b) {
    return breakpoints[a] - breakpoints[b];
  });
}
/**
 * Get a value of margin or containerPadding.
 *
 * @param  {Array | Object} param Margin | containerPadding, e.g. [10, 10] | {lg: [10, 10], ...}.
 * @param  {String} breakpoint   Breakpoint: lg, md, sm, xs and etc.
 * @return {Array}
 */


var script$2 = VueGridLayoutProps.extend({
  name: 'VueResponsiveGridLayout',
  components: {
    VueGridLayout: __vue_component__$1
  },
  props: {
    breakpoint: {
      type: String
    },
    breakpoints: {
      type: Object,
      "default": function _default() {
        return {
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480,
          xxs: 0
        };
      }
    },
    cols: {
      type: [Array, Object],
      "default": function _default() {
        return {
          lg: 12,
          md: 10,
          sm: 6,
          xs: 4,
          xxs: 2
        };
      }
    },
    layouts: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    margin: {
      type: [Object, Array],
      "default": function _default() {
        return [10, 10];
      }
    },
    containerPadding: {
      type: [Object, Array],
      "default": function _default() {
        return {
          lg: null,
          md: null,
          sm: null,
          xs: null,
          xxs: null
        };
      }
    }
  },
  data: function data() {
    return {
      currentLayout: [],
      currentBreakpoint: '',
      currentCols: 12,
      currentLayouts: {}
    };
  },
  watch: {
    layouts: {
      handler: function handler(newVal, oldVal) {
        if (!lodash_isequal(newVal, oldVal)) {
          this.currentLayout = findOrGenerateResponsiveLayout(newVal, this.breakpoints, this.currentBreakpoint, this.currentBreakpoint, this.currentCols, this.compactType);
          this.currentLayouts = newVal;
        }
      }
    },
    width: function width(newVal, oldVal) {
      if (newVal != oldVal) {
        this.onWidthChange();
      }
    },
    breakpoints: {
      handler: function handler(newVal, oldVal) {
        if (!lodash_isequal(newVal, oldVal)) {
          this.onWidthChange();
        }
      },
      deep: true
    },
    breakpoint: function breakpoint(newVal, oldVal) {
      if (newVal != oldVal) {
        this.onWidthChange();
      }
    },
    cols: {
      handler: function handler(newVal, oldVal) {
        if (!lodash_isequal(newVal, oldVal)) {
          this.onWidthChange();
        }
      },
      deep: true
    }
  },
  created: function created() {
    this.generateInitialState();
  },
  methods: {
    generateInitialState: function generateInitialState() {
      var breakpoint = getBreakpointFromWidth(this.breakpoints, this.width);
      var colNo = getColsFromBreakpoint(breakpoint, this.cols); // Get the initial layout. This can tricky; we try to generate one however possible if one doesn't exist
      // for this layout.

      this.currentLayout = findOrGenerateResponsiveLayout(this.layouts, this.breakpoints, breakpoint, breakpoint, colNo, this.compactType);
      this.currentBreakpoint = breakpoint;
      this.currentCols = colNo;
    },
    // wrap layouts so we do not need to pass layouts to child
    onLayoutChange: function onLayoutChange(layout) {
      this.$emit('layoutChange', layout, _objectSpread(_objectSpread({}, this.layouts), {}, _defineProperty({}, this.currentBreakpoint, layout)));
    },

    /**
     * When the width changes work through breakpoints and reset state with the new width & breakpoint.
     * Width changes are necessary to figure out the widget widths.
     */
    onWidthChange: function onWidthChange() {
      var newBreakpoint = this.breakpoint || getBreakpointFromWidth(this.breakpoints, this.width);
      var lastBreakpoint = this.currentBreakpoint;
      var newCols = getColsFromBreakpoint(newBreakpoint, this.cols);

      var newLayouts = _objectSpread({}, this.layouts); // Breakpoint change


      if (lastBreakpoint !== newBreakpoint) {
        // Preserve the current layout if the current breakpoint is not present in the next layouts.
        if (!(lastBreakpoint in newLayouts)) newLayouts[lastBreakpoint] = cloneLayout(this.currentLayout); // Find or generate a new layout.

        var layout = findOrGenerateResponsiveLayout(newLayouts, this.breakpoints, newBreakpoint, lastBreakpoint, newCols, this.compactType); // This adds missing items.

        layout = synchronizeLayoutWithChildren(layout, this.$refs.layout.$children, newCols, this.compactType); // Store the new layout.

        newLayouts[newBreakpoint] = layout; // events

        this.$emit('layoutChange', layout, newLayouts);
        this.$emit('onBreakpointChange', newBreakpoint, newCols);
        this.currentBreakpoint = newBreakpoint;
        this.currentLayout = layout;
        this.currentCols = newCols;
      }

      var margin = this.getIndentationValue(this.margin, newBreakpoint);
      var containerPadding = this.getIndentationValue(this.containerPadding, newBreakpoint); //call onWidthChange on every change of width, not only on breakpoint changes

      this.$emit('widthChange', this.width, margin, newCols, containerPadding);
    },
    getIndentationValue: function getIndentationValue(param, breakpoint) {
      if (param == null) return null;
      return Array.isArray(param) ? param : param[breakpoint];
    }
  }
});
/* script */

var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__$2() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('VueGridLayout', _vm._b({
    ref: "layout",
    attrs: {
      "margin": _vm.getIndentationValue(_vm.margin, _vm.currentBreakpoint),
      "container-padding": _vm.getIndentationValue(_vm.containerPadding, _vm.currentBreakpoint),
      "layout": _vm.currentLayout,
      "cols": _vm.currentCols
    },
    on: {
      "layoutChange": _vm.onLayoutChange
    },
    scopedSlots: _vm._u([{
      key: "item",
      fn: function fn(props) {
        return _vm._t("item", null, null, props);
      }
    }], null, true)
  }, 'VueGridLayout', _vm.$props, false));
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

var WidthProvider = Vue__default['default'].extend({
  name: 'WidthProvider',
  props: {
    measureBeforeMount: {
      type: Boolean,
      "default": false
    },
    width: {
      type: Number,
      required: false,
      "default": null
    }
  },
  data: function data() {
    return {
      currentWidth: 1280,
      mounted: false
    };
  },
  created: function created() {
    if (this.width) {
      this.currentWidth = this.width;
    }
  },
  mounted: function mounted() {
    this.mounted = true;
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },
  beforeDestroy: function beforeDestroy() {
    this.mounted = false;
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    onWindowResize: function onWindowResize() {
      if (!this.mounted) {
        return;
      }

      var node = this.$el;

      if (node instanceof HTMLElement) {
        this.currentWidth = node.offsetWidth;
      }
    }
  },
  render: function render(h) {
    if (this.measureBeforeMount && !this.mounted) {
      return h('div');
    }

    return this.$scopedSlots["default"] ? this.$scopedSlots["default"]({
      width: this.currentWidth
    })[0] : h();
  }
});
exports.VueGridItem = __vue_component__;
exports.VueGridLayout = __vue_component__$1;
exports.VueResponsiveGridLayout = __vue_component__$2;
exports.WidthProvider = WidthProvider;
//# sourceMappingURL=vue-responsive-grid-layout.common.js.map
