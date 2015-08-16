/* global musje */

(function (musje) {
  'use strict';

  var
    defineProperty = Object.defineProperty,
    push = Array.prototype.push,
    objForEach = musje.objForEach;

  function camel(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  function defaultValue(model, $ref) {
    var tmp = $ref.split('/'), groupName = tmp[1], schemaName = tmp[2];
    return model[groupName] && model[groupName][schemaName] &&
           model[groupName][schemaName].default;
  }

  function getObjectName(model, $ref) {
    var
      names = $ref.split('/'),
      groupName = names[1];

    return (groupName === 'objects' || groupName === 'namedObjects' ||
            groupName === 'arrays' || groupName === 'root') &&
           names[2];
  }

  function makeObjectProperty(namespace, obj, propName, type) {
    var
      varName = '_' + propName,
      Constructor = namespace[type];

    if (!Constructor) { throw new Error('Undefined type: ' + type); }

    defineProperty(obj, propName, {
      get: function () {
        if (this[varName] === undefined) {
          this[varName] = new Constructor();
        }
        return this[varName];
      },
      set: function (v) { this[varName] = new Constructor(v); }
    });
  }

  function defineClass(namespace, groupName, type, model) {
    var
      Constructor = namespace[type] =  function (obj) {
        for (var key in obj) { this[key] = obj[key]; }
      },
      proto = Constructor.prototype,
      propNames = [];

    proto.$type = type;

    objForEach(model[groupName][type], function (descriptor, propName) {
      var defaultVal, objName;

      // ES5 accessor property
      if (descriptor.get || descriptor.set) {
        defineProperty(proto, propName, descriptor);

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
          makeObjectProperty(namespace, proto, propName, objName);
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
          inner = result[this.$type] = {},
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

  function defineSimpleClass(namespace, type, model) {
    var
      Constructor = namespace[type] =  function (val) {
        this.value = val;
      },
      proto = Constructor.prototype,
      defaultValue = model.namedObjects[type].default;

    proto.$type = type;

    objForEach(model.namedObjects[type], function (descriptor, propName) {

      if (descriptor.default !== undefined) {
        proto.value = descriptor.default;

      // Method
      } else if (typeof descriptor === 'function') {
        proto[propName] = descriptor;
      }
    });

    proto.toJSON = function () {
      var result = {};
      result[type] = this.value;
      return result;
    };
  }

  function defineArrayClass(namespace, type, model) {
    var
      schema = model.arrays[type],
      constructorName;

    if (Array.isArray(schema)) {
      namespace[type] = function (a) {
        var arr = [];
        arr.push = function () {
          objForEach(arguments, function (item) {
            var
              propName = Object.keys(item)[0],
              Constructor = namespace[camel(propName)];
            push.call(arr, new Constructor(item[propName]));
          });
        };
        arr.push.apply(arr, a);
        return arr;
      };

    } else {
      constructorName = getObjectName(model, model.arrays[type].$ref);
      namespace[type] = function (a) {
        var arr = [];
        arr.push = function () {
          objForEach(arguments, function (item) {
            push.call(arr, new namespace[constructorName](item));
          });
        };
        arr.push.apply(arr, a);
        return arr;
      };
    }
  }

  function defineArrayClasses(namespace, model) {
    objForEach(model.arrays, function (descriptor, type) {
      defineArrayClass(namespace, type, model);
    });
  }

  function defineClasses(namespace, model, groupName) {
    objForEach(model[groupName], function (descriptor, type) {
      if (groupName === 'namedObjects' && descriptor.type) {
        defineSimpleClass(namespace, type, model);
      } else {
        defineClass(namespace, groupName, type, model);
      }
    });
  }

  musje.makeClasses = function (model) {
    var rootName = Object.keys(model.root)[0];
    defineArrayClasses(musje, model);
    defineClasses(musje, model, 'objects');
    defineClasses(musje, model, 'namedObjects');
    defineClass(musje, 'root', rootName, model);
    musje[rootName].prototype.stringify = function (replacer, space) {
      return JSON.stringify(this, replacer, space);
    };
  };

}(musje));
