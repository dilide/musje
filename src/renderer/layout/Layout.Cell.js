/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Cell = Layout.Cell = function (cell, defs, lo) {
    this._defs = defs;
    this._lo = lo;
    this.data = cell;
    this.x = lo.measurePaddingRight;
  };

  Cell.prototype.flow = function () {
    var
      defs = this._defs,
      lo = this._lo,
      x = 0,
      minHeight;

    this.data.forEach(function (data) {
      var def = data.def = defs.get(data);
      data.x = x;
      data.y = 0;
      x += def.width + lo.musicDataSep;
      minHeight = Math.min(minHeight, def.height);
    });

    this.minWidth = x;
    this.minHeight = minHeight;
  };

  Cell.prototype._reflow = function () {
    var cell = this;
    this.data.forEach(function (data) {
      data.x *= cell.width / cell.minWidth;
    });
  };

  defineProperty(Cell.prototype, 'measure', {
    get: function () {
      return this._m;
    },
    set: function (measure) {
      this._m = measure;
      this.el = measure.el.g().addClass('mus-cell');
      this.height = measure.height;
    }
  });

  defineProperty(Cell.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
      this._reflow();
    }
  });

  defineProperty(Cell.prototype, 'y2', {
    get: function () {
      return this._y2;
    },
    set: function (y2) {
      this._y2 = y2;
      this.el.transform(Snap.matrix().translate(this.x, y2));
    }
  });

}(musje.Layout, Snap));
