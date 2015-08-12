/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var
    defineProperty = Object.defineProperty,
    objExtend = musje.objExtend;

  var Measure = musje.Layout.Measure = function (measure, system) {
    this.el = system.el.g().addClass('mus-measure');
    this.height = system.height;
    objExtend(this, measure);
  };

  defineProperty(Measure.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(Measure.prototype, 'x', {
    get: function () {
      return this._x;
    },
    set: function (x) {
      this._x = x;
      this.el.transform(Snap.matrix().translate(x, 0));
    }
  });

}(musje, Snap));
