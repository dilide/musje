/* global musje */

(function (musje) {
  'use strict';

  var
    push = Array.prototype.push,
    objForEach = musje.objForEach,
    camel = musje.camel;

  function defaultValue(model, $ref) {
    var tmp = $ref.split('/'), groupName = tmp[1], schemaName = tmp[2];
    return model[groupName] && model[groupName][schemaName] &&
           model[groupName][schemaName].default;
  }

  function getObjectName(model, $ref) {
    var tmp = $ref.split('/'), groupName = tmp[1];
    return (groupName === 'objects' || groupName === 'namedObjects' ||
            groupName === 'arrays' || groupName === 'root') &&
           tmp[2];
  }

  function makeObjectProperty(obj, propName, type) {
    var varName = '_' + propName, Constructor;

    Constructor = musje[type];
    if (!Constructor) { throw new Error('Undefined type: musje.' + type); }

    Object.defineProperty(obj, propName, {
      get: function () {
        if (this[varName] === undefined) {
          this[varName] = new Constructor();
        }
        return this[varName];
      },
      set: function (v) { this[varName] = new Constructor(v); }
    });
  }

  function defineClass(nameSpace, groupName, objectName, model) {
    var
      className = camel(objectName),
      Constructor = nameSpace[className] =  function (obj) {
        for (var key in obj) { this[key] = obj[key]; }
      },
      proto = Constructor.prototype,
      propNames = [];

    proto.__name__ = objectName;

    objForEach(model[groupName][objectName], function (descriptor, propName) {
      var defaultVal, objName;

      // ES5 accessor property
      if (descriptor.get || descriptor.set) {
        Object.defineProperty(proto, propName, descriptor);

      // Default value of primitive types
      } else if (descriptor.default !== undefined) {
        proto[propName] = descriptor.default;
        propNames.push(propName);

      // Schema reference
      } else if (descriptor.$ref) {
        defaultVal = defaultValue(model, descriptor.$ref);
        objName = getObjectName(model, descriptor.$ref);
        if (defaultVal !== undefined) {
          proto[propName] = defaultVal;
        } else if (objName) {
          makeObjectProperty(proto, propName, camel(objName));
        }
        propNames.push(propName);

      // Method
      } else if (typeof descriptor === 'function') {
        proto[propName] = descriptor;
      }
    });

    if (groupName === 'namedObjects') {
      proto.toJSON = function () {
        var result = {},
          inner = result[this.__name__] = {},
          i, propName;
        for (i = 0; i < propNames.length; i++) {
          propName = propNames[i];
          inner[propName] = this[propName];
        }
        return result;
      };
    } else {
      proto.toJSON = function () {
        var result = {}, i, propName;
        for (i = 0; i < propNames.length; i++) {
          propName = propNames[i];
          result[propName] = this[propName];
        }
        return result;
      };
    }
  }

  function defineSimpleClass(nameSpace, objectName, model) {
    var
      className = camel(objectName),
      Constructor = nameSpace[className] =  function (val) {
        this.value = val;
      },
      proto = Constructor.prototype,
      defaultValue = model.namedObjects[objectName].default;

    proto.__name__ = objectName;

    objForEach(model.namedObjects[objectName], function (descriptor, propName) {

      if (descriptor.default !== undefined) {
        proto.value = descriptor.default;

      // Method
      } else if (typeof descriptor === 'function') {
        proto[propName] = descriptor;
      }
    });

    proto.toJSON = function () {
      var result = {};
      result[objectName] = this.value;
      return result;
    };
  }

  function defineArrayClass(nameSpace, arrayName, model) {
    var
      className = camel(arrayName),
      schema = model.arrays[arrayName],
      constructorName;

    if (Array.isArray(schema)) {
      nameSpace[className] = function (a) {
        var arr = [];
        arr.push = function () {
          objForEach(arguments, function (item) {
            var propName = Object.keys(item)[0],
              Constructor = nameSpace[camel(propName)];
            push.call(arr, new Constructor(item[propName]));
          });
        };
        arr.push.apply(arr, a);
        return arr;
      };
    } else {

      constructorName = camel(getObjectName(model, model.arrays[arrayName].$ref));
      nameSpace[className] = function (a) {
        var arr = [];
        arr.push = function () {
          objForEach(arguments, function (item) {
            push.call(arr, new nameSpace[constructorName](item));
          });
        };
        arr.push.apply(arr, a);
        return arr;
      };
    }
  }

  function defineClasses(nameSpace, model, groupName) {
    if (groupName === 'arrays') {
      objForEach(model[groupName], function (descriptor, objectName) {
        defineArrayClass(nameSpace, objectName, model);
      });
    } else {
      objForEach(model[groupName], function (descriptor, objectName) {
        if (groupName === 'namedObjects' && descriptor.type) {
          defineSimpleClass(nameSpace, objectName, model);
        } else {
          defineClass(nameSpace, groupName, objectName, model);
        }
      });
    }
  }

  musje.makeClasses = function (model) {
    var rootName = Object.keys(model.root)[0];
    defineClasses(musje, model, 'arrays');
    defineClasses(musje, model, 'objects');
    defineClasses(musje, model, 'namedObjects');
    defineClass(musje, 'root', rootName, model);
    musje[musje.camel(rootName)].prototype.stringify = function (replacer, space) {
      return JSON.stringify(this, replacer, space);
    };
  };

}(musje));
