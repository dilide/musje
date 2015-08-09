var musje = musje || {};

(function (musje) {
  'use strict';

  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  var objForEach =
  musje.objForEach = function (obj, cb) {
    if (isObject(obj)) {
      Object.keys(obj).forEach(function (key) {
        cb(obj[key], key);
      });
    }
  };

  musje.objExtend = function(obj, ext) {
    objForEach(ext, function (val, key) { obj[key] = val; });
    return obj;
  };

  musje.near = function (a, b) {
    return Math.abs(a - b) < 0.00001;
  };

  musje.camel = function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  };

}(musje));
