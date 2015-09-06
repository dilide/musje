/* global musje, Snap */

(function (musje, Snap) {
  'use strict';

  /**
   * TimewiseMeasure Layout mixin.
   * @mixin
   */
  musje.LayoutTimewiseMeasure =
  /** @lends musje.LayoutTimewiseMeasure# */
  {
    /**
     * Minimun width of the measure.
     * @type {number}
     */
    minWidth: {
      get: function () {
        var minWidth = 0;
        this.parts.forEach(function (cell) {
          minWidth = Math.max(minWidth, cell.minWidth);
        });
        return minWidth + this.padding;
      }
    },

    /**
     * Reference to the parent system of this measure.
     * - (Getter)
     * - (Setter) The measure el will be created, and the height of the measure will be set.
     * @type {musje.Layout.System}
     */
    system: {
      get: function () {
        return this._s;
      },
      set: function (system) {
        this._s = system;

        /**
         * Measure SVG group element.
         * @memberof musje.LayoutTimewiseMeasure#
         * @alias el
         * @type {Element}
         * @readonly
         */
        this.el = system.el.g().addClass('mus-measure');
      }
    },

    padding: {
      get: function () {
        var lo = this.layout.options;
        return lo.measurePaddingRight + lo.measurePaddingLeft;
      }
    },

    outerWidth: {
      get: function () {
        return this.outerWidthLeft + this.outerWidthRight;
      }
    },

    outerWidthLeft: {
      get: function () {
        return this.layout.options.measurePaddingLeft +
                this.barLeftInSystem.width / 2;
      }
    },

    outerWidthRight: {
      get: function () {
        return this.layout.options.measurePaddingRight +
                this.barRightInSystem.width / 2;
      }
    },

    /**
     * Width of the measure.
     * - (Getter)
     * - (Setter) Set width of the measure and also set the widths of the containing cells.
     * @type {number}
     */
    width: {
      get: function () {
        return this._w || (this._w = this.minWidth);
      },
      set: function (w) {
        this._w = w;
        var outerWidth = this.outerWidth;

        this.parts.forEach(function (cell) {
          cell.width = w - outerWidth;
        });
      }
    },

    height: {
      get: function () {
        return this.system.height;
      }
    },

    minHeight: {
      get: function () {
        var
          minHeight = 0,
          partSep = this.layout.options.partSep;

        this.parts.forEach(function (cell) {
          minHeight += cell.height + partSep;
        });
        return minHeight ? minHeight - partSep : 0;
      }
    },

    /**
     * The x position of the measure in the system.
     * - (Getter)
     * - (Setter) Set x cause the measure element to translate.
     * @type {number}
     */
    x: {
      get: function () {
        return this._x;
      },
      set: function (x) {
        this._x = x;
        this.el.transform(Snap.matrix().translate(x, 0));
      }
    },

    /**
     * If the measure in the beginning of the system.
     * @type {boolean}
     * @readonly
     */
    inSystemBegin: {
      get: function () {
        return this._sIndex === 0;
      }
    },

    /**
     * If the measure in the end of the system.
     * @type {boolean}
     * @readonly
     */
    inSystemEnd: {
      get: function () {
        return this._sIndex === this.system.measures.length - 1;
      }
    },

    /**
     * Left bar of the measure in system.
     * @type {musje.Bar}
     * @readonly
     */
    barLeftInSystem: {
      get: function () {
        return this.parts[0].barLeftInSystem;
      }
    },

    /**
     * Right bar of the measure in system.
     * @type {musje.Bar}
     * @readonly
     */
    barRightInSystem: {
      get: function () {
        return this.parts[0].barRightInSystem;
      }
    },

    /**
     * Flow the measure.
     */
    flow: function () {
      var measure = this;
      measure.parts.forEach(function (cell) {

        /**
         * Cell SVG group element.
         * @memberof musje.LayoutCell#
         * @alias el
         * @type {Element}
         * @readonly
         */
        cell.el = measure.el.g().addClass('mus-cell');

        cell.x = measure.outerWidthLeft;

        // cell.drawBox();
      });
    },

    /**
     * Draw box of the cell.
     * @return {Element} The box SVG rect element.
     */
    drawBox: function () {
      this._boxEl = this.el.rect(0, 0, this.width, this.height)
                                .attr({ stroke: 'green', fill: 'none' });
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

  musje.defineProperties(musje.TimewiseMeasure.prototype,
                         musje.LayoutTimewiseMeasure);

}(musje, Snap));
