/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var
    defineProperty = Object.defineProperty,
    objExtend = musje.objExtend,
    Layout = musje.Layout;

  // @constructor Measure
  // @param m {number} Index of measure in the system.
  var Measure = Layout.Measure = function (measure, lo) {
    this._lo = lo;
    objExtend(this, measure);
  };

  Measure.prototype.calcMinWidth = function () {
    var lo = this._lo, minWidth = 0;

    this.parts.forEach(function (cell) {
      minWidth = Math.max(minWidth, cell.minWidth);
    });

    this._padding = lo.measurePaddingLeft + lo.measurePaddingRight;
    this.minWidth = minWidth + this._padding;
  };

  Measure.prototype.flow = function () {
    var measure = this;
    this.parts = this.parts.map(function (cell) {
      cell.measure = measure;
      cell.y2 = measure.system.height;

      // cell.el.rect(0, -cell.height, cell.width, cell.height)
      //   .addClass('bbox');

      return cell;
    });
  };

  defineProperty(Measure.prototype, 'system', {
    get: function () {
      return this._s;
    },
    set: function (system) {
      this._s = system;
      this.el = system.el.g().addClass('mus-measure');
      this.height = system.height;
    }
  });

  defineProperty(Measure.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
      var padding = this._padding;
      this.parts.forEach(function (cell) {
        cell.width = w - padding;
      });
    }
  });

  defineProperty(Measure.prototype, 'x', {
    get: function () {
      return this._x;
    },
    set: function (x) {
      this._x = x;
      this.el.transform(Snap.matrix().translate(x, 0));
    }
  });

  defineProperty(Measure.prototype, 'barLeft', {
    get: function () {
      return this._barLeft;
    },
    set: function (bar) {
      this._barLeft = bar;
    }
  });

  defineProperty(Measure.prototype, 'barRight', {
    get: function () {
      return this._barLeft;
    },
    set: function (bar) {
      this._barLeft = bar;
    }
  });

}(musje, Snap));
