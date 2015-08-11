/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Content = Layout.Content = function (body, header, lo) {
    this._body = body;
    this._header = header;
    this._lo = lo;
    this.el = body.el.g().addClass('mus-content');
    this.width = body.width;
  };

  Content.prototype._resizeBody = function () {
    var lo = this._lo, headerHeight = this._header.height;
    this._body.height = this.height +
              (headerHeight ? headerHeight + lo.headerSep : 0);
  };

  defineProperty(Content.prototype, 'offset', {
    get: function () {
      return this._o;
    },
    set: function (o) {
      this._o = o;
      this.el.transform(Snap.matrix().translate(0, o));
      this._resizeBody();
    }
  });

  defineProperty(Content.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(Content.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
      this._resizeBody();
    }
  });

}(musje.Layout, Snap));
