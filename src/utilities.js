
/**
 * The musje namespace.
 * @namespace
 */
var musje = {};

if (typeof exports !== 'undefined') {
  exports = musje;
}

(function (musje) {
  'use strict';

  var defineProperty = Object.defineProperty;

  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  /**
   * Utility method, for each object key.
   * @function musje.objEach
   * @param {Object} obj - The object to be iterated.
   * @param {musje~objEachCallback} cb - The callback for each iteration.
   */
  var objEach =
  musje.objEach = function (obj, cb) {
    if (isObject(obj)) {
      Object.keys(obj).forEach(function (key) {
        cb(obj[key], key);
      });
    }
  };

  /**
   * A callback that will be called for each iteration in {@link musje.objEach}.
   * @callback musje~objEachCallback
   * @param {*} value - Value of the current property.
   * @param {string} key - Key of the current property.
   */

  /**
   * Utility method, extend `obj` with `ext`.
   * @function
   * @param {Object} obj - target object to be extended.
   * @param {Object} ext - the extension object.
   * @return {Object} The target object.
   */
  musje.extend = function(obj, ext) {
    objEach(ext, function (val, key) { obj[key] = val; });
    return obj;
  };

  /**
   * Utility method, checking if `a` and `b` is close *enongh*.
   * Useful to simulate the floating number equality check.
   * @function
   * @param {number} a - a number.
   * @param {number} b - another number.
   * @return {boolean} Wether `a` and `b` is close.
   */
  musje.near = function (a, b) {
    return Math.abs(a - b) < 0.00001;
  };


  /**
   * Define ES5 getter/setter properties
   * @param {Object} obj - The object to be defined.
   * @param {Object} props - ES5 getter/setter properties.
   * For example:
   * ```
   * {
   *   name: {
   *     get: function () {...},
   *     set: function () {...}
   *   },
   *   age: {
   *      get:...
   *   }
   * }
   * ```
   */
  musje.defineProperties = function (obj, props) {
    musje.objEach(props, function (value, prop) {
      var
        type = typeof value,
        descriptor;

      // Accessor property.
      if (type === 'object' && (typeof value.get === 'function' ||
                                typeof value.set === 'function')) {
        descriptor = value;

      // Function
      } else if (type === 'function' || prop === '$type') {
        descriptor = { value: value };

      } else {
        descriptor = {
          value: value,
          writable: true,
          enumerable: true
        };
      }

      defineProperty(obj, prop, descriptor);
    });
  };

  musje.toJSONWithDefault = true;

  musje.makeToJSON = function (values, elName) {
    return function () {
      var
        that = this,
        result = {};

      musje.objEach(values, function (defaultValue, prop) {
        if (musje.toJSONWithDefault || that[prop] !== defaultValue) {
          result[prop] = that[prop];
        }
      });
      if (!elName) { return result; }

      var res = {};
      res[elName] = result;
      return res;
    };
  };

  /**
   * @memberof musje
   * @member {Object} parser.parse
   * @function
   * @param {string} input
   * @return {Object} A plain musje score object.
   */

  /**
   * @function
   * @param {string} input - Input of the musje source code.
   * @return {musje.Score} - A `musje.Score` instance.
   */
  musje.parse = function (input) {
    var plainScore = musje.parser.parse(input);
    return new musje.Score(plainScore);
  };

}(musje));
