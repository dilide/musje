/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param measure {Object}
   */
  musje.TimewiseMeasure = function (measure) {
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
        this._parts = parts.map(function (cell) {
          return new musje.Cell(cell);
        });
      }
    }
  });

}(musje));
