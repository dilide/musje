/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  /**
   * @mixin
   */
  musje.LayoutCell =
  /** @lends  musje.LayoutCell# */
  {
    /**
     * Flow the cell.
     */
    flow: function () {
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
    },

    /**
     * Reflow the cell.
     * @protected
     */
    _reflow: function () {
      var cell = this;
      this.data.forEach(function (data) {
        data.x *= cell.width / cell.minWidth;
      });
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
     * The x position of the cell in parent timewise measure.
     * - Set the x value will cause the cell element translate.
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
     * The y2 position of the cell in parent timewise measure.
     * - Set the y2 value will cause the cell element translate.
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
    },

    /**
     * The left bar of this cell.
     * - barLeft at first measure of a system:
     * ```
     * |]  -> |
     * :|  -> |
     * :|: -> |:
     * ```
     * @type {musje.Bar}
     * @readonly
     */
    barLeftInSystem: {
      get: function () {
        var bar = this.barLeft;
        if (!bar) { return { width: 0, height: 0 }; }

        // First measure in the system.
        if (this.measure.inSystemBegin) {
          if (bar.value === 'end' || bar.value === 'repeat-end') {
            bar = new musje.Bar('single');
          } else if (bar.value === 'repeat-both') {
            bar = new musje.Bar('repeat-begin');
          }
        }
        bar.def = this.layout.defs.get(bar);
        return bar;
      }
    },

    /**
     * The right bar of this cell.
     * - barRight at last measure of a system:
     * ```
     *  |: ->  |
     * :|: -> :|
     * ```
     * @type {musje.Bar}
     * @readonly
     */
    barRightInSystem: {
      get: function () {
        var
          bar = this.barRight,
          system = this.measure.system;

        if (!bar) { return { width: 0, height: 0 }; }

        // Last measure in the system.
        if (system && this.measure.inSystemEnd) {
          if (bar.value === 'repeat-begin') {
            bar = new musje.Bar('single');
          } else if (bar.value === 'repeat-both') {
            bar = new musje.Bar('repeat-end');
          }
        }
        bar.def = this.layout.defs.get(bar);
        return bar;
      }
    },

    /**
     * Draw box of the cell.
     * @return {Element} The box SVG rect element.
     */
    drawBox: function () {
      this._boxEl = this.el.rect(0, -this.height, this.width, this.height)
                           .addClass('bbox');
      return this._boxEl;
    },

    /**
     * Clear the box SVG element.
     */
    clearBox: function () {
      this._boxEl.remove();
      this._boxEl = undefined;
    }
  };

  musje.defineProperties(musje.Cell.prototype, musje.LayoutCell);

}(musje, Snap));
