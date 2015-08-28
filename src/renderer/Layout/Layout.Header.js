/* global musje */

(function (Layout) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Header = Layout.Header = function (layout) {
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
      var layout = this._layout;
      layout.content.y = h ? h + layout.options.headerSep : 0;
      this._h = h;
    }
  });

}(musje.Layout));
