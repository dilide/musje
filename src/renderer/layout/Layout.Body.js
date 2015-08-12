/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Body = Layout.Body = function (svg, lo) {
    this._svg = svg;
    this._lo = lo;
    this.el = svg.el.g()
        .transform(Snap.matrix().translate(lo.marginLeft, lo.marginTop))
        .addClass('mus-body');
    this.width = lo.width - lo.marginLeft - lo.marginRight;
  };

  defineProperty(Body.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(Body.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      var lo = this._lo;
      this._svg.height = h + lo.marginTop + lo.marginBottom;
    }
  });

}(musje.Layout, Snap));
