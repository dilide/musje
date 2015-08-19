/* global musje, Snap */

(function (CellPrototype, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  CellPrototype.flow = function (defs, lo) {
    var that = this, x = 0, minHeight;

    this.data.forEach(function (data, d) {
      var def = data.def = defs.get(data);
      data.cell = that;
      data.index = d;
      data.x = x;
      data.y = 0;
      x += def.width + lo.musicDataSep;
      minHeight = Math.min(minHeight, def.height);
    });

    this.minWidth = x;
    this.minHeight = minHeight;
  };

  CellPrototype._reflow = function () {
    var cell = this;
    this.data.forEach(function (data) {
      data.x *= cell.width / cell.minWidth;
    });
  };

  defineProperty(CellPrototype, 'measure', {
    get: function () {
      return this._m;
    },
    set: function (measure) {
      this._m = measure;
      this.el = measure.el.g().addClass('mus-cell');
      this.height = measure.height;
    }
  });

  defineProperty(CellPrototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
      this._reflow();
    }
  });

  defineProperty(CellPrototype, 'x', {
    get: function () {
      return this._x;
    },
    set: function (x) {
      this._x = x;
      this.el.transform(Snap.matrix().translate(x, this.y2));
    }
  });

  defineProperty(CellPrototype, 'y2', {
    get: function () {
      return this._y2;
    },
    set: function (y2) {
      this._y2 = y2;
      this.el.transform(Snap.matrix().translate(this.x, y2));
    }
  });

}(musje.Cell.prototype, Snap));
