/* global musje */

(function (Layout) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Header = Layout.Header = function (layout, lo) {
    this._lo = lo;
    this._layout = layout;
    this.el = layout.body.el.g().addClass('mus-header');
    this.width = layout.body.width;
  };

  defineProperty(Header.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(Header.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
      this._layout.content.y = h ? h + this._lo.headerSep : 0;
    }
  });

}(musje.Layout));
