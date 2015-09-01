/* global musje */

(function (musje) {
  'use strict';

  var properties =
  /** @lends musje.TimewiseMeasures# */
  {
    /**
     * Make timewise score measures from the partwise parts.
     */
    fromPartwise: function () {
      var that = this;

      that.length = 0; // remove all data if exists

      this.score.walkCells(function (cell, m) {
        that[m] = that[m] || new musje.TimewiseMeasure(m, that);
        that[m].parts.push(cell);
      });
    }
  };

  /**
   * Construct timewise score measures.
   * @class
   * @classdesc Timewise score measures.
   * @param score {musje.Score}
   * @augments {Array}
   */
  musje.TimewiseMeasures = function (score) {

    var measures = [];

    /**
     * Reference to the parent score.
     * @memberof musje.TimewiseMeasures#
     * @alias score
     * @type {musje.Score}
     */
    measures.score = score;
    musje.defineProperties(measures, properties);
    return measures;
  };

}(musje));
