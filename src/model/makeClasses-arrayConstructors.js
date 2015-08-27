/* global musje */

(function (makeClasses) {
  'use strict';

  var
    slice = Array.prototype.slice,
    push = Array.prototype.push,
    keys = Object.keys;

  function camel(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  // The array construtors are not *real* constructors.

  makeClasses.ArrayOfHetroObjects = function (namespace) {

    // Overwrite array push function with applying the child constructor.
    function ArrayOfHetroObjects(a) {
      var arr = [];

      arr.add = function () {
        slice.call(arguments).forEach(function (item) {
          var
            propName = keys(item)[0],
            ItemConstructor = namespace[camel(propName)];

          push.call(arr, new ItemConstructor(item[propName]));
        });
      };

      arr.add.apply(arr, a);
      return arr;
    }
    return ArrayOfHetroObjects;
  };

  makeClasses.ArrayOfHomoObjects = function (namespace, type) {

    function ArrayOfHomoObjects(a) {
      var arr = [];
      arr.add = function () {
        slice.call(arguments).forEach(function (item) {
          push.call(arr, new namespace[type](item));
        });
      };
      arr.add.apply(arr, a);
      return arr;
    }

    return ArrayOfHomoObjects;
  };

  makeClasses.ArrayOfPrimitives = function () {

    function ArrayOfPrimitives(a) {
      var arr = [];
      arr.push.apply(arr, a);
      return arr;
    }

    return ArrayOfPrimitives;
  };

}(musje.makeClasses));
