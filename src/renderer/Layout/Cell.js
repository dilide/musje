/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  /**
   * Flow the cell.
   */
  musje.Cell.prototype.flow = function () {
    var
      defs = this.layout.defs,
      lo = this.layout.options,
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

  /**
   * @protected
   */
  musje.Cell.prototype._reflow = function () {
    var cell = this;
    this.data.forEach(function (data) {
      data.x *= cell.width / cell.minWidth;
    });
  };

  musje.defineProperties(musje.Cell.prototype,
  /** @lends  musje.Cell.prototype */
  {
    /**
     * A back reference to the parent measure.
     * - (Getter)
     * - (Setter)
     * @type {musje.TimewiseMeasure}
     */
    measure: {
      get: function () {
        return this._m;
      },
      set: function (measure) {
        this._m = measure;
        this.el = measure.el.g().addClass('mus-cell');
        this.height = measure.height;
      }
    },

    /**
     * Width
     * - (Getter) Get the cell width.
     * - (Setter) Set the cell width, and this will cause the cell to reflow (`this._reflow()` will be called).
     * @type {number}
     */
    width: {
      get: function () {
        return this._w;
      },
      set: function (w) {
        this._w = w;
        this._reflow();
      }
    },

    /**
     * X
     * @type {number}
     */
    x: {
      get: function () {
        return this._x;
      },
      set: function (x) {
        this._x = x;
        this.el.transform(Snap.matrix().translate(x, this.y2));
      }
    },

    /**
     * Y2
     * @type {number}
     */
    y2: {
      get: function () {
        return this._y2;
      },
      set: function (y2) {
        this._y2 = y2;
        this.el.transform(Snap.matrix().translate(this.x, y2));
      }
    }
  });

}(musje, Snap));
