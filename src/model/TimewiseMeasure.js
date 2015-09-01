/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param measure {Object}
   * @mixes musje.LayoutTimewiseMeasure
   */
  musje.TimewiseMeasure = function (index, measures) {

    /**
     * Index of this measure in the timewise score measures.
     * @member {number}
     * @protected
     */
    this._index = index;

    /**
     * Reference to the parent measures instance.
     * @member {musje.TimewiseMeasures}
     */
    this.measures = measures;
  };

  musje.defineProperties(musje.TimewiseMeasure.prototype,
  /** @lends musje.TimewiseMeasure# */
  {
    /**
     * Parts in timewise measure.
     * @type {Array.<musje.Cells>}
     */
    parts: {
      get: function () {
        return this._parts || (this._parts = []);
      },
      set: function (parts) {
        this._parts = parts;
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
    }

  });

}(musje));
