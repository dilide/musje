/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  var
    defineProperty = Object.defineProperty,
    objExtend = musje.objExtend,
    Layout = musje.Layout;

  // @constructor Measure
  // @param m {number} Index of measure in the system.
  var Measure = Layout.Measure = function (measure, system, lo) {
    this._system = system;
    this._lo = lo;
    this.el = system.el.g().addClass('mus-measure');
    this.height = system.height;
    objExtend(this, measure);
  };

  Measure.prototype.layoutCells = function () {
    var that = this, system = this._system;
    this.parts = this.parts.map(function (cell) {
      cell = new Layout.Cell(cell, that, that._lo);
      cell.y2 = system.height;
      cell.width = cell.minWidth;

      // cell.el.rect(0, -cell.height, cell.width, cell.height)
      //   .addClass('bbox');
      return cell;
    });
  };

  defineProperty(Measure.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
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
