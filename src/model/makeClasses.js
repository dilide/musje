/* global musje */

(function (musje) {
  'use strict';

  var
    defineProperty = Object.defineProperty,
    keys = Object.keys,
    objEach = musje.objEach,
    extend = musje.extend;

  function defaultValue(model, $ref) {
    var tmp = $ref.split('/'), category = tmp[1], schemaName = tmp[2];
    return model[category] && model[category][schemaName] &&
           model[category][schemaName].default;
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

  function defineClass(namespace, model, category, type) {
    var
      Constructor = namespace[type] = function (obj) {
        extend(this, obj);
        this.initialize.apply(this, arguments);
      },
      proto = Constructor.prototype,
      propNames = [];

    proto.$name = type;
    proto.initialize = function () {};

    objEach(model[category][type], function (descriptor, propName) {
      var defaultVal, objName;

      // ES5 accessor property
      // -----------------------------------------------------------
      if (descriptor.get || descriptor.set) {
        defineProperty(proto, propName, descriptor);

      // Method
      // -----------------------------------------------------------
      } else if (typeof descriptor === 'function') {
        proto[propName] = descriptor;

      // Default value of primitive types
      // -----------------------------------------------------------
      } else if (descriptor.default !== undefined) {
        proto[propName] = descriptor.default;
        propNames.push(propName);

      // Schema reference
      // -----------------------------------------------------------
      } else if (descriptor.$ref) {
        defaultVal = defaultValue(model, descriptor.$ref);
        objName = descriptor.$ref.split('/')[2];
        if (defaultVal !== undefined) {
          proto[propName] = defaultVal;
        } else if (objName) {
          makeObjectProperty(namespace, proto, propName, objName);
        }
        propNames.push(propName);
      }
    });



    if (category === 'elements') {
      proto.toJSON = function () {
        var result = {},
          inner = result[this.$name] = {},
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

  function makeSimpleClass(model, type) {
    var
      Constructor = function (val) { this.value = val; },
      proto = Constructor.prototype,
      defaultValue = model.elements[type].default;

    proto.$name = type;

    objEach(model.elements[type], function (descriptor, propName) {

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

    return Constructor;
  }


  // @constructor ClassMaker
  // Makes classes from the model and stores them in the namespace.
  var makeClasses = musje.makeClasses = function (namespace, model) {

    // Make array classes
    // ------------------------------------------------------------
    objEach(model.arrays, function (descriptor, type) {
      if (Array.isArray(descriptor)) {
        namespace[type] = makeClasses.ArrayOfHetroObjects(namespace);
      } else if (descriptor.$ref) {
        namespace[type] = makeClasses.ArrayOfHomoObjects(namespace,
                                        descriptor.$ref.split('/')[2]);
      } else {
        namespace[type] = makeClasses.ArrayOfPrimitives();
      }
    });

    // Make object classes
    // ------------------------------------------------------------
    keys(model.objects).forEach(function (type) {
      defineClass(namespace, model, 'objects', type);
    });

    // Make element classes
    // ------------------------------------------------------------
    objEach(model.elements, function (descriptor, type) {
      if (descriptor.type) {
        namespace[type] = makeSimpleClass(model, type);
      } else {
        defineClass(namespace, model, 'elements', type);
      }
    });

    // Make root class
    // ------------------------------------------------------------
    var rootName = keys(model.root)[0];
    defineClass(namespace, model,'root', rootName);
    namespace[rootName].prototype.stringify = function (replacer, space) {
      return JSON.stringify(this, replacer, space);
    };
  };

}(musje));
