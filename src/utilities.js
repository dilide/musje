var musje = {};

if (typeof exports !== 'undefined') {
  exports = musje;
}

(function (musje) {
  'use strict';

  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  var objEach =
  musje.objEach = function (obj, cb) {
    if (isObject(obj)) {
      Object.keys(obj).forEach(function (key) {
        cb(obj[key], key);
      });
    }
  };

  musje.extend = function(obj, ext) {
    objEach(ext, function (val, key) { obj[key] = val; });
    return obj;
  };

  musje.near = function (a, b) {
    return Math.abs(a - b) < 0.00001;
  };

}(musje));
