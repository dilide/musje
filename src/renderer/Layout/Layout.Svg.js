/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Svg = Layout.Svg = function (layout) {
    this._layout = layout;
    var lo = layout.options;

    this.el = Snap(layout.svg).attr({
        fontFamily: lo.fontFamily
      }).addClass('musje');
    this.el.clear();
    this.width = lo.width;
  };

  defineProperty(Svg.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
      this.el.attr('width', w);
      var body = this._layout.body;
      if (body) { body.width = w; }
    }
  });

  defineProperty(Svg.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
      this.el.attr('height', h);
    }
  });

}(musje.Layout, Snap));
