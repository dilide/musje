/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  var Cell = Layout.Cell = function (cell, measure, lo) {
    this._lo = lo;
    this._value = cell;
    this.el = measure.el.g().addClass('mus-cell');
    this.x = lo.measurePaddingRight;
    this.height = measure.height;
  };

  Cell.prototype.forEach = function (cb) {
    this._value.forEach(cb);
  };

  Cell.prototype.get = function (i) {
    return this._value[i];
  };

  Cell.prototype.layoutMusicData = function () {
    var lo = this._lo, x = 0;

    this.forEach(function (data) {
      switch (data.__name__) {
      case 'rest':  // fall through
      case 'note':
        data.pos = { x: x, y: 0 };
        x += data.def.width + lo.musicDataSep;
        break;
      case 'time':
        data.pos = { x: x, y: 0 };
        x += data.def.width + lo.musicDataSep;
        break;
      }
    });
  };

  defineProperty(Cell.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
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
