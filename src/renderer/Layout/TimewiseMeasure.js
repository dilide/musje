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
     * Calculate minimum measure width.
     * @return {number} The minimum measure width.
     */
    calcMinWidth: function () {
      var lo = this.layout.options, minWidth = 0;

      this.parts.forEach(function (cell) {
        minWidth = Math.max(minWidth, cell.minWidth);
      });

      this._padding = lo.measurePaddingLeft + lo.measurePaddingRight;
      this.minWidth = minWidth + this._padding;
    },

    /**
     * Flow the measure.
     */
    flow: function () {
      var measure = this;
      measure.parts = measure.parts.map(function (cell) {

        /**
         * Cell SVG group element.
         * @memberof musje.LayoutCell#
         * @alias el
         * @type {Element}
         * @readonly
         */
        cell.el = measure.el.g().addClass('mus-cell');

        cell.height = measure.height;
        cell._x = measure.barLeftInSystem.width / 2 +
                  measure.layout.options.measurePaddingRight;

        cell.y2 = measure.system.height;

        // cell.drawBox();

        return cell;
      });
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

        /**
         * Height of the measure.
         * @memberof musje.LayoutTimewiseMeasure#
         * @alias height
         * @type {number}
         * @readonly
         */
        this.height = system.height;
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
    }
  };

  musje.defineProperties(musje.TimewiseMeasure.prototype,
                         musje.LayoutTimewiseMeasure);

}(musje, Snap));
