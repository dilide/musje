/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Body = Layout.Body = function (layout) {
    this._layout = layout;
    var
      svg = layout.svg,
      lo = layout.options;

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
      var layout = this._layout;
      if (layout.header) { layout.header.width = w; }
      if (layout.content) { layout.content.width = w; }
    }
  });

  defineProperty(Body.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      var layout = this._layout, lo = layout.options;
      layout.svg.height = h + lo.marginTop + lo.marginBottom;
    }
  });

}(musje.Layout, Snap));
