/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param measure {Object}
   */
  musje.TimewiseMeasure = function (measure, index, measures) {

    /**
     * Index of this part in the measures.
     * @member {number}
     */
    this.index = index;

    /**
     * Reference to the parent measures instance.
     * @member {musje.TimewiseMeasures}
     */
    this.measures = measures;

    musje.extend(this, measure);
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

    prev: {
      get: function () {
        return this.measures.at(this.index - 1);
      }
    }

  });

}(musje));
