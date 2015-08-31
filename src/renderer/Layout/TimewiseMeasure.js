/* global musje, Snap */

(function (TimewiseMeasurePrototype, Snap) {
  'use strict';

  musje.defineProperties(musje.TimewiseMeasure.prototype,
  /** @lends musje.TimewiseMeasure# */
  {
    calcMinWidth: function () {
      var lo = this.layout.options, minWidth = 0;

      this.parts.forEach(function (cell) {
        minWidth = Math.max(minWidth, cell.minWidth);
      });

      this._padding = lo.measurePaddingLeft + lo.measurePaddingRight;
      this.minWidth = minWidth + this._padding;
    },

    flow: function () {
      var measure = this;
      measure.parts = measure.parts.map(function (cell) {
        cell.el = measure.el.g().addClass('mus-cell');
        cell.height = measure.height;
        cell._x = measure.barLeft.width / 2 +
                  measure.layout.options.measurePaddingRight;

        cell.y2 = measure.system.height;

        // cell.el.rect(0, -cell.height, cell.width, cell.height)
        //   .addClass('bbox');

        return cell;
      });
    },

    system: {
      get: function () {
        return this._s;
      },
      set: function (system) {
        this._s = system;
        this.el = system.el.g().addClass('mus-measure');
        this.height = system.height;
      }
    },

    width: {
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
    },

    x: {
      get: function () {
        return this._x;
      },
      set: function (x) {
        this._x = x;
        this.el.transform(Snap.matrix().translate(x, 0));
      }
    },

    barLeft: {
      get: function () {
        return this.parts[0].barLeft;
      }
    },

    barRight: {
      get: function () {
        return this.parts[0].barRight;
      }
    }

  });

}(musje.TimewiseMeasure.prototype, Snap));
