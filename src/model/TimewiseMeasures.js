/* global musje */

(function (musje) {
  'use strict';

  /**
   * @class
   * @param measures {Array}
   * @param score {musje.Score}
   */
  musje.TimewiseMeasures = function (score) {
    this.score = score;

    /**
     * Array value of the timewise measures.
     * @member {Array}
     * @readonly
     */
    this.value = [];
  };

  musje.defineProperties(musje.TimewiseMeasures.prototype,
  /** @lends musje.TimewiseMeasures# */
  {

    at: function (index) {
      return this.value[index];
    },

    fromPartwise: function () {
      var
        that = this,
        value = that.value;

      value.length = 0; // remove all data if exists

      this.score.walkCells(function (cell, m) {
        value[m] = value[m] || new musje.TimewiseMeasure(that, m, that.score);
        value[m].parts.push(cell);
      });
    },

    toJSON: function () {
      return this.value;
    }
  });

}(musje));
