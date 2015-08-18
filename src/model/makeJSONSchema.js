/* global musje */

(function (musje) {
  'use strict';

  var
    extend = musje.extend,
    objEach = musje.objEach;

  // TODO: To be implemented without dependency...
  function objDeepClone(obj) {
    return angular.copy(obj);
  }

  function noAccessor(obj) {
    var result = objDeepClone(obj);
    objEach(result, function (val, key) {
      if (val.get || val.set) { delete result[key]; }
    });
    return result;
  }

  musje.makeJSONSchema = function (model) {
    var schema = extend({
      $schema: 'http://json-schema.org/draft-04/schema#'
    }, model);

    // Group of schema definitions with name: integers, objects, arrays...
    objEach(schema, function (rawGroup, groupName) {
      var newGroup;

      switch (groupName) {
      case 'integers':
        newGroup = schema.integers = {};
        objEach(rawGroup, function (val, key) {
          newGroup[key] = extend({ type: 'integer' }, val);
        });
        break;
      case 'root':
        delete schema.root;
        schema.type = 'object';
        schema.properties = rawGroup[Object.keys(rawGroup)[0]];
        schema.additionalProperties = false;
        break;
      case 'objects':
        newGroup = schema.objects = {};
        objEach(rawGroup, function (val, key) {
          newGroup[key] = {
            type: 'object',
            properties: noAccessor(val),
            additionalProperties: false
          };
        });
        break;
      case 'elements':
        newGroup = schema.elements = {};
        objEach(rawGroup, function (val, key) {
          newGroup[key] = {
            type: 'object',
            properties: {},
            additionalProperties: false
          };
          newGroup[key].properties[key] = val.type ? val : {
            type: 'object',
            properties: noAccessor(val),
            additionalProperties: false
          };
        });
        break;
      case 'arrays':
        newGroup = schema.arrays = {};
        objEach(rawGroup, function (val, key) {
          newGroup[key] = {
            type: 'array',
            items: val,
            addtionalItems: false
          };
          if (Array.isArray(val)) {
            newGroup[key].items = { oneOf: val };
          }
        });
        break;
      }
    });

    return schema;
  };

}(musje));
