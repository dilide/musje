/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var System = Layout.System = function (content, lo) {
    this._lo = lo;
    this.el = content.el.g().addClass('mus-system');
    this.width = content.width;
    this.measures = [];
  };

  defineProperty(System.prototype, 'offset', {
    get: function () {
      return this._o;
    },
    set: function (o) {
      this._o = o;
      this.el.transform(Snap.matrix().translate(0, o));
    }
  });

  defineProperty(System.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(System.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
    }
  });

}(musje.Layout, Snap));
